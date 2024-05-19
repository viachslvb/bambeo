using Application.Models.Dtos.User;

namespace Application.Models.Dtos.Account
{
    public class LoginToReturnDto
    {
        public UserDto User { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}