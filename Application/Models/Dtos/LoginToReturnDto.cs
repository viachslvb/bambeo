namespace Application.Models.Dtos
{
    public class LoginToReturnDto
    {
        public UserDto User { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}