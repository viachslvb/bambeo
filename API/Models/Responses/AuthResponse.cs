using API.Models.Dtos;

namespace API.Models.Responses
{
    public class AuthResponse
    {
        public UserDto User { get; set; }
        public string Token { get; set; }
    }
}
