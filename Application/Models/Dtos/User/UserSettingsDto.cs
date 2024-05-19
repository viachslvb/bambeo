using System.ComponentModel.DataAnnotations;

namespace Application.Models.Dtos.User
{
    public class UserSettingsDto
    {
        [Required]
        public bool NotificationsForFollowedProducts { get; set; }

        [Required]
        public bool GeneralPromotionalEmails { get; set; }
    }
}
