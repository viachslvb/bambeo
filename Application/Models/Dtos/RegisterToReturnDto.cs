namespace Application.Models.Dtos
{
    public class RegisterToReturnDto
    {
        public UserDto User { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}