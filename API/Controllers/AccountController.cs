using API.BackgroundTasks;
using API.Extensions;
using API.Models.ApiResponses;
using API.Models.Dtos;
using API.Models.Enums;
using API.Models.Responses;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly ILogger<AccountController> _logger;


        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
            ITokenService tokenService, ILogger<AccountController> logger, IMapper mapper)
        {
            _logger = logger;
            _mapper = mapper;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailFromClaimsPrincipal(User);

            if (user == null) return Unauthorized(new ApiErrorResponse(ApiErrorCode.AuthorizationRequired));

            return Ok(new ApiResponse<UserDto>
            (
                new UserDto
                {
                    Email = user.Email,
                    DisplayName = user.DisplayName
                }
            ));
        }

        [DisallowAuthenticated]
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            var loginFailedApiResponse = new ApiErrorResponse(ApiErrorCode.LoginFailed);

            if (user == null) return BadRequest(loginFailedApiResponse);

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return BadRequest(loginFailedApiResponse);

            // Generate JWT and Refresh Token
            var token = _tokenService.CreateToken(user);
            var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user, Request.HttpContext.Connection.RemoteIpAddress.ToString());

            // Set the refresh token in an HTTP-only cookie
            Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict, Expires = DateTime.UtcNow.AddDays(7) });

            return Ok(new ApiResponse<AuthResponse>
            (
                new AuthResponse
                {
                    User = new UserDto
                    {
                        Email = user.Email,
                        DisplayName = user.DisplayName
                    },
                    Token = token
                }
            ));
        }

        [DisallowAuthenticated]
        [HttpPost("signup")]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> Register(RegisterDto registerDto)
        {
            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);

            if (existingUser != null)
            { 
                return BadRequest(new ApiValidationErrorResponse(ApiErrorCode.EmailAlreadyInUse)
                {
                    Errors = new[] { "Adres email jest już używany" }
                });
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new ApiErrorResponse(ApiErrorCode.BadRequest));
            }

            // Generate JWT and Refresh Token
            var token = _tokenService.CreateToken(user);
            var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user, Request.HttpContext.Connection.RemoteIpAddress.ToString());

            // Set the refresh token in an HTTP-only cookie
            Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict, Expires = DateTime.UtcNow.AddDays(7) });

            // Send a welcome email
            BackgroundJob.Enqueue<IEmailBackgroundTasks>(x => x.SendWelcomeEmailAsync(user.Id));

            return Ok(new ApiResponse<AuthResponse>
            (
                new AuthResponse
                {
                    User = new UserDto
                    {
                        Email = user.Email,
                        DisplayName = user.DisplayName
                    },
                    Token = token
                }
            ));
        }

        [Authorize]
        [HttpGet("logout")]
        public IActionResult LogOut()
        {
            if (HttpContext.Request.Cookies.ContainsKey("refreshToken"))
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(-1)
                };
                Response.Cookies.Append("refreshToken", string.Empty, cookieOptions);
            }

            return Ok(new ApiResponse<string>
            ("Logged out successfully."));
        }

        [HttpGet("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var unauthorizedApiErrorResponse = new ApiErrorResponse(ApiErrorCode.InvalidRefreshToken);

            if (!HttpContext.Request.Cookies.ContainsKey("refreshToken"))
            {
                return Unauthorized(unauthorizedApiErrorResponse);
            }

            var oldRefreshToken = Request.Cookies["refreshToken"];
            var refreshToken = await _tokenService.GetRefreshTokenAsync(oldRefreshToken);

            if (refreshToken == null || !refreshToken.IsActive)
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(-1)
                };
                Response.Cookies.Append("refreshToken", string.Empty, cookieOptions);

                return Unauthorized(unauthorizedApiErrorResponse);
            }

            string ipAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString();

            await _tokenService.RevokeRefreshTokenAsync(refreshToken, ipAddress);

            // Generate a new refresh token for the user
            var newRefreshToken = await _tokenService.GenerateRefreshTokenAsync(refreshToken.User, ipAddress);

            // Issue new JWT
            var jwtToken = _tokenService.CreateToken(refreshToken.User);

            Response.Cookies.Append("refreshToken", newRefreshToken.Token, new CookieOptions { HttpOnly = true, Secure = true, Expires = DateTime.UtcNow.AddDays(7) });

            return Ok(new ApiResponse<string>
            (
                jwtToken
            ));
        }

        [HttpGet("email-exists")]
        public async Task<ActionResult<ApiResponse<EmailExistsResponse>>> CheckEmailExistsAsync([FromQuery] string email)
        {
            if (email == null)
            {
                return BadRequest(new ApiErrorResponse(ApiErrorCode.BadRequest));
            }

            var result = await _userManager.FindByEmailAsync(email) != null;

            return Ok(new ApiResponse<EmailExistsResponse>(
                new EmailExistsResponse
                {
                    Exists = result
                }
            ));
        }

        [HttpGet("confirm-email")]
        public async Task<ActionResult<ApiResponse<EmailConfirmationResponse>>> ConfirmEmailAsync([FromQuery] string userId, [FromQuery] string token)
        {
            if (userId == null || token == null)
            {
                return BadRequest(new ApiErrorResponse(ApiErrorCode.BadRequest));
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogError($"User with ID '{userId}' is not found.");
                return BadRequest(new ApiErrorResponse(ApiErrorCode.EmailConfirmationFailed));
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

                    return BadRequest(new ApiErrorResponse(ApiErrorCode.InvalidEmailConfirmationToken));
                }

                if (emailAlreadyConfirmed)
                {
                    return BadRequest(new ApiErrorResponse(ApiErrorCode.EmailAlreadyConfirmed));
                }

                return Ok(new ApiResponse<EmailConfirmationResponse>(
                    new EmailConfirmationResponse
                    {
                        IsConfirmed = result.Succeeded
                    }
                ));
            }
            catch(Exception ex)
            {
                _logger.LogError($"An error occurred while confirming the email for user with ID '{user.Id}': Error Message: {ex.Message}");
                return BadRequest(new ApiErrorResponse(ApiErrorCode.EmailConfirmationFailed));
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null || !await _userManager.IsEmailConfirmedAsync(user))
            {
                _logger.LogError($"User with email '{model.Email}' is not found or email is not confirmed.");

                // Don't reveal that the user does not exist or is not confirmed
                return Ok(new ApiResponse<ForgotPasswordResponse>(
                    new ForgotPasswordResponse
                    {
                        Success = true
                    }
                ));
            }

            BackgroundJob.Enqueue<IEmailBackgroundTasks>(x => x.SendPasswordResetEmailAsync(user.Id));

            return Ok(new ApiResponse<ForgotPasswordResponse>(
                new ForgotPasswordResponse
                {
                    Success = true
                }
            ));
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(PasswordResetDto model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user == null)
            {
                _logger.LogError($"User with ID '{model.UserId}' is not found.");

                return BadRequest(new ApiErrorResponse(ApiErrorCode.PasswordResetFailed));
            }

            try
            {
                var tokenDecodedBytes = WebEncoders.Base64UrlDecode(model.Token);
                var tokenDecoded = Encoding.UTF8.GetString(tokenDecodedBytes);

                var passwordResetResult = await _userManager.ResetPasswordAsync(user, tokenDecoded, model.Password);

                if (!passwordResetResult.Succeeded)
                {
                    foreach (var error in passwordResetResult.Errors)
                    {
                        _logger.LogError($"An error occurred while resetting the password for user with ID '{user.Id}': Error Code: {error.Code}, Description: {error.Description}");
                    }

                    return BadRequest(new ApiErrorResponse(ApiErrorCode.PasswordResetFailed));
                }

                string ipAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString();
                await _tokenService.RevokeAllRefreshTokensByUserIdAsync(user.Id, ipAddress);

                return Ok(new ApiResponse<PasswordResetResponse>(
                    new PasswordResetResponse
                    {
                        Success = true
                    }
                ));
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while resetting the password for user with ID '{user.Id}': Error Message: {ex.Message}");
                return BadRequest(new ApiErrorResponse(ApiErrorCode.PasswordResetFailed));
            }
        }
    }
}
