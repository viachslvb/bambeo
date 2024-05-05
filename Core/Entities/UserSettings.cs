using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Core.Entities.Identity;

namespace Core.Entities
{
    public class UserSettings
    {
        [Key, ForeignKey("User")]
        public string UserId { get; set; }
        public virtual AppUser User { get; set; }
        public bool NotificationsForFollowedProducts { get; set; }
        public bool GeneralPromotionalEmails { get; set; }
    }
}