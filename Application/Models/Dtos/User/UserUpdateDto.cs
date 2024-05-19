using System.ComponentModel.DataAnnotations;

namespace Application.Models.Dtos.User
{
    public class UserUpdateDto
    {
        [Required]
        public string DisplayName { get; set; }
    }
}
