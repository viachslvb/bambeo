using System.ComponentModel.DataAnnotations;

namespace Application.Models.Dtos.Account
{
    public class EmailExistsDto
    {
        [Required]
        public string Email { get; set; }
    }
}
