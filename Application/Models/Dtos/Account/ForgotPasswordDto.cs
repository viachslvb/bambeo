using System.ComponentModel.DataAnnotations;

namespace Application.Models.Dtos.Account
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}