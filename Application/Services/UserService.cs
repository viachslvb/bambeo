using Application.Enums;
using Application.Helpers;
using Application.Interfaces;
using Application.Models.Dtos;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ILogger<UserService> _logger;
        private readonly IEmailBackgroundTasks _emailBackgroundTasks;
        private readonly IUserSettingsRepository _userSettingsRepository;

        public UserService(UserManager<AppUser> userManager, IMapper mapper, ILogger<UserService> logger,
            IEmailBackgroundTasks emailBackgroundTasks, IUserSettingsRepository userSettingsRepository)
        {
            _userManager = userManager;
            _mapper = mapper;
            _logger = logger;
            _emailBackgroundTasks = emailBackgroundTasks;
            _userSettingsRepository = userSettingsRepository;
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

        public async Task<ServiceResult<UserDto>> UpdateUserByEmailAsync(string email, UserUpdateDto userUpdateDto)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                _logger.LogError($"The user associated with the provided email was not found.");
                return ServiceResult<UserDto>.FailureResult(ErrorCode.UserNotFound);
            }

            user.DisplayName = userUpdateDto.DisplayName != null
                ? userUpdateDto.DisplayName.RemoveExtraSpaces().ToTitleCase()
                : user.DisplayName;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    _logger.LogError($"An error occurred while updating the user profile for user with ID '{user.Id}': Error Code: {error.Code}, Description: {error.Description}");
                }

                return ServiceResult<UserDto>.FailureResult(ErrorCode.BadRequest);
            }

            UserDto userDto = _mapper.Map<UserDto>(user);
            return ServiceResult<UserDto>.SuccessResult(userDto);
        }

        public async Task<ServiceResult<bool>> SendEmailVerificationLinkToEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                _logger.LogError($"The user associated with the provided email was not found.");
                return ServiceResult<bool>.FailureResult(ErrorCode.UserNotFound);
            }

            _emailBackgroundTasks.SendVerificationLinkEmail(user.Id);
            return ServiceResult<bool>.SuccessResult(true);
        }

        public async Task<ServiceResult<bool>> SendChangePasswordLinkToEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                _logger.LogError($"The user associated with the provided email was not found.");
                return ServiceResult<bool>.FailureResult(ErrorCode.UserNotFound);
            }

            _emailBackgroundTasks.SendChangePasswordEmail(user.Id);
            return ServiceResult<bool>.SuccessResult(true);
        }

        public async Task<ServiceResult<UserSettingsToReturnDto>> GetUserSettingsByEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                _logger.LogError($"The user associated with the provided email was not found.");
                return ServiceResult<UserSettingsToReturnDto>.FailureResult(ErrorCode.UserNotFound);
            }

            var settings = await _userSettingsRepository.GetByUserIdAsync(user.Id);
            if (settings == null)
            {
                _logger.LogWarning($"User settings not found for user ID: {user.Id}");
                return ServiceResult<UserSettingsToReturnDto>.FailureResult(ErrorCode.NotFound);
            }

            var userSettingsDto = _mapper.Map<UserSettingsToReturnDto>(settings);
            return ServiceResult<UserSettingsToReturnDto>.SuccessResult(userSettingsDto);
        }

        public async Task<ServiceResult<UserSettingsToReturnDto>> UpdateUserSettingsByEmailAsync(string email, 
            UserSettingsDto userSettingsDto)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                _logger.LogError($"The user associated with the provided email was not found.");
                return ServiceResult<UserSettingsToReturnDto>.FailureResult(ErrorCode.UserNotFound);
            }

            var settings = await _userSettingsRepository.GetByUserIdAsync(user.Id);
            if (settings == null)
            {
                _logger.LogWarning($"User settings not found for user ID: {user.Id}");
                return ServiceResult<UserSettingsToReturnDto>.FailureResult(ErrorCode.NotFound);
            }

            settings.GeneralPromotionalEmails = userSettingsDto.GeneralPromotionalEmails;
            settings.NotificationsForFollowedProducts = userSettingsDto.NotificationsForFollowedProducts;

            await _userSettingsRepository.UpdateAsync(settings);

            var updatedUserSettingsDto = _mapper.Map<UserSettingsToReturnDto>(settings);
            return ServiceResult<UserSettingsToReturnDto>.SuccessResult(updatedUserSettingsDto);
        }
    }
}
