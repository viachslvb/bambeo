using System.ComponentModel.DataAnnotations;

namespace API.Models.Dtos
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
