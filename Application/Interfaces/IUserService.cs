using Application.Helpers;
using Application.Models.Dtos;

namespace Application.Interfaces
{
    public interface IUserService
    {
        Task<ServiceResult<UserDto>> GetUserByEmailAsync(string email);
        Task<ServiceResult<UserDto>> UpdateUserByEmailAsync(string email, UserUpdateDto userUpdateDto);
        Task<ServiceResult<bool>> SendEmailVerificationLinkToEmailAsync(string email);
        Task<ServiceResult<bool>> SendChangePasswordLinkToEmailAsync(string email);
        Task<ServiceResult<UserSettingsToReturnDto>> GetUserSettingsByEmailAsync(string email);
        Task<ServiceResult<UserSettingsToReturnDto>> UpdateUserSettingsByEmailAsync(string email, UserSettingsDto userSettingsDto);
    }
}
