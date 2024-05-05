using System.ComponentModel.DataAnnotations;

namespace Application.Models.Dtos
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}