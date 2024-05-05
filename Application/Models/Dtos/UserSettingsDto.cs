using System.ComponentModel.DataAnnotations;

namespace Application.Models.Dtos
{
    public class UserSettingsDto
    {
        [Required]
        public bool NotificationsForFollowedProducts { get; set; }

        [Required]
        public bool GeneralPromotionalEmails { get; set; }
    }
}
