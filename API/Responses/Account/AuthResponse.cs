using Application.Models.Dtos;

namespace API.Responses.Account
{
    public class AuthResponse
    {
        public UserDto User { get; set; }
        public string Token { get; set; }
    }
}
