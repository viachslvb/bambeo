using Application.Models.Dtos.User;

namespace API.Responses.Account
{
    public class AuthResponse
    {
        public UserDto User { get; set; }
        public string Token { get; set; }
    }
}
