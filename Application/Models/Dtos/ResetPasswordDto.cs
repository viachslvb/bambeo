using System.ComponentModel.DataAnnotations;

namespace Application.Models.Dtos
{
    public class ResetPasswordDto
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        [RegularExpression("(?=^.{8,16}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$",
            ErrorMessage = "Hasło musi mieć od 8 do 16 znaków, zawierać przynajmniej jedną dużą literę, jedną małą literę, jedną cyfrę i jeden znak specjalny")]
        public string Password { get; set; }
    }
}