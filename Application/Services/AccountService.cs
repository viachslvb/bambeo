using Application.Enums;
using Application.Helpers;
using Application.Interfaces;
using Application.Models.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Interfaces.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using System.Text;

namespace Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IMapper _mapper;
        private readonly ILogger<AccountService> _logger;
        private readonly ITokenService _tokenService;
        private readonly IUserSettingsRepository _userSettingsRepository;
        private readonly IEmailBackgroundTasks _emailBackgroundTasks;

        public AccountService(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IMapper mapper, 
            ILogger<AccountService> logger, ITokenService tokenService, IUserSettingsRepository userSettingsRepository, 
            IEmailBackgroundTasks emailBackgroundTasks)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _mapper = mapper;
            _tokenService = tokenService;
            _userSettingsRepository = userSettingsRepository;
            _emailBackgroundTasks = emailBackgroundTasks;
        }

        public async Task<ServiceResult<UserDto>> GetUserByEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                _logger.LogError($"The user associated with the provided email was not found.");
                return ServiceResult<UserDto>.FailureResult(ErrorCode.UserNotFound);
            }

            UserDto userDto = _mapper.Map<UserDto>(user);

            return ServiceResult<UserDto>.SuccessResult(userDto);
        }

        public async Task<ServiceResult<LoginToReturnDto>> LoginUserAsync(LoginDto loginDto, string ipAddress)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return ServiceResult<LoginToReturnDto>.FailureResult(ErrorCode.LoginFailed);
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded)
            {
                return ServiceResult<LoginToReturnDto>.FailureResult(ErrorCode.LoginFailed);
            }

            var accessToken = _tokenService.CreateAccessToken(user);
            var refreshToken = await _tokenService.GenerateTokenAsync(user, ipAddress, loginDto.RememberMe);

            var userDto = _mapper.Map<UserDto>(user);
            LoginToReturnDto loginToReturnDto = new()
            {
                User = userDto,
                Token = accessToken,
                RefreshToken = refreshToken.Token
            };

            return ServiceResult<LoginToReturnDto>.SuccessResult(loginToReturnDto);
        }

        public async Task<ServiceResult<RegisterToReturnDto>> RegisterUserAsync(RegisterDto registerDto, string ipAddress)
        {
            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);

            if (existingUser != null)
            {
                return ServiceResult<RegisterToReturnDto>.FailureResult(ErrorCode.EmailAlreadyInUse);
            }

            var user = new AppUser
            {
                CreatedAt = DateTime.UtcNow,
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return ServiceResult<RegisterToReturnDto>.FailureResult(ErrorCode.BadRequest);
            }

            // Create Settings for User
            await CreateUserSettingsAsync(user.Id, registerDto);

            // Generate JWT and Refresh Token
            var accessToken = _tokenService.CreateAccessToken(user);
            var refreshToken = await _tokenService.GenerateTokenAsync(user, ipAddress);

            // Send a Welcome Email
            _emailBackgroundTasks.SendWelcomeEmail(user.Id);

            var userDto = _mapper.Map<UserDto>(user);
            RegisterToReturnDto registerToReturnDto = new()
            {
                User = userDto,
                Token = accessToken,
                RefreshToken = refreshToken.Token
            };

            return ServiceResult<RegisterToReturnDto>.SuccessResult(registerToReturnDto);
        }

        private async Task CreateUserSettingsAsync(string userId, RegisterDto registerDto)
        {
            var settings = new UserSettings
            {
                UserId = userId,
                NotificationsForFollowedProducts = true, // TODO: Get value from registerDto
                GeneralPromotionalEmails = true // TODO: Get value from registerDto
            };

            await _userSettingsRepository.CreateAsync(settings);
        }

        public async Task<ServiceResult<bool>> EmailExistsAsync(EmailExistsDto emailExistsDto)
        {
            var exists = await _userManager.FindByEmailAsync(emailExistsDto.Email) != null;
            return ServiceResult<bool>.SuccessResult(exists);
        }

        public async Task<ServiceResult<bool>> ConfirmEmailAsync(ConfirmEmailDto confirmEmailDto)
        {
            var userId = confirmEmailDto.UserId;
            var token = confirmEmailDto.Token;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogError($"The user associated with the provided email was not found.");
                return ServiceResult<bool>.FailureResult(ErrorCode.EmailConfirmationFailed);
            }

            var emailAlreadyConfirmed = user.EmailConfirmed;

            try
            {
                var tokenDecodedBytes = WebEncoders.Base64UrlDecode(token);
                var tokenDecoded = Encoding.UTF8.GetString(tokenDecodedBytes);

                var result = await _userManager.ConfirmEmailAsync(user, tokenDecoded);

                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        _logger.LogError($"An error occurred while confirming the email for user with ID '{user.Id}': Error Code: {error.Code}, Description: {error.Description}");
                    }

                    return ServiceResult<bool>.FailureResult(ErrorCode.InvalidEmailConfirmationToken);
                }

                if (emailAlreadyConfirmed)
                {
                    return ServiceResult<bool>.FailureResult(ErrorCode.EmailAlreadyConfirmed);
                }

                return ServiceResult<bool>.SuccessResult(result.Succeeded);
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while confirming the email for user with ID '{user.Id}': Error Message: {ex.Message}");
                return ServiceResult<bool>.FailureResult(ErrorCode.EmailConfirmationFailed);
            }
        }

        public async Task<ServiceResult<bool>> SendResetPasswordLinkAsync(ForgotPasswordDto forgotPasswordDto)
        {
            string email = forgotPasswordDto.Email;
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null || !await _userManager.IsEmailConfirmedAsync(user))
            {
                _logger.LogError($"The user associated with the provided email was not found or email is not confirmed.");
                return ServiceResult<bool>.SuccessResult(false);
            }

            _emailBackgroundTasks.SendResetPasswordEmail(user.Id);
            return ServiceResult<bool>.SuccessResult(true);
        }

        public async Task<ServiceResult<bool>> ResetPasswordAsync(ResetPasswordDto resetPasswordDto, string ipAddress)
        {
            var userId = resetPasswordDto.UserId;
            var token = resetPasswordDto.Token;
            var newPassword = resetPasswordDto.Password;

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                _logger.LogError($"The user associated with the provided email was not found.");
                return ServiceResult<bool>.FailureResult(ErrorCode.PasswordResetFailed);
            }

            try
            {
                var tokenDecodedBytes = WebEncoders.Base64UrlDecode(token);
                var tokenDecoded = Encoding.UTF8.GetString(tokenDecodedBytes);

                var passwordResetResult = await _userManager.ResetPasswordAsync(user, tokenDecoded, newPassword);

                if (!passwordResetResult.Succeeded)
                {
                    foreach (var error in passwordResetResult.Errors)
                    {
                        _logger.LogError($"An error occurred while resetting the password for user with ID '{user.Id}': Error Code: {error.Code}, Description: {error.Description}");
                    }
                    return ServiceResult<bool>.FailureResult(ErrorCode.PasswordResetFailed);
                }
                
                await _tokenService.RevokeAllTokensByUserIdAsync(user.Id, ipAddress);
                return ServiceResult<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while resetting the password for user with ID '{user.Id}': Error Message: {ex.Message}");
                return ServiceResult<bool>.FailureResult(ErrorCode.PasswordResetFailed);
            }
        }

        public async Task<ServiceResult<bool>> DeleteUserByEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                _logger.LogError($"The user associated with the provided email was not found.");
                return ServiceResult<bool>.FailureResult(ErrorCode.UserNotFound);
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    _logger.LogError($"An error occurred while deleting the user with ID '{user.Id}': Error Code: {error.Code}, Description: {error.Description}");
                }

                return ServiceResult<bool>.FailureResult(ErrorCode.FailedDeleteUser);
            }

            return ServiceResult<bool>.SuccessResult(result.Succeeded);
        }
    }
}
