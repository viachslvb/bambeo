using System.ComponentModel.DataAnnotations;

namespace Application.Models.Dtos
{
    public class EmailExistsDto
    {
        [Required]
        public string Email { get; set; }
    }
}
