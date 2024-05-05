using Application.Helpers;
using Application.Models.Dtos;

namespace Application.Interfaces
{
    public interface IAccountService
    {
        Task<ServiceResult<UserDto>> GetUserByEmailAsync(string email);
        Task<ServiceResult<LoginToReturnDto>> LoginUserAsync(LoginDto loginDto, string ipAddress);
        Task<ServiceResult<RegisterToReturnDto>> RegisterUserAsync(RegisterDto registerDto, string ipAddress);
        Task<ServiceResult<bool>> DeleteUserByEmailAsync(string email);
        Task<ServiceResult<bool>> EmailExistsAsync(EmailExistsDto emailExistsDto);
        Task<ServiceResult<bool>> ConfirmEmailAsync(ConfirmEmailDto confirmEmailDto);
        Task<ServiceResult<bool>> SendResetPasswordLinkAsync(ForgotPasswordDto forgotPasswordDto);
        Task<ServiceResult<bool>> ResetPasswordAsync(ResetPasswordDto resetPasswordDto, string ipAddress);
    }
}