using System.ComponentModel.DataAnnotations;

namespace Application.Models.Dtos
{
    public class UserUpdateDto
    {
        [Required]
        public string DisplayName { get; set; }
    }
}
