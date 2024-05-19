namespace Application.Models.Dtos.User
{
    public class UserSettingsToReturnDto
    {
        public EmailSettingsDto EmailSettings { get; set; }
    }

    public class EmailSettingsDto
    {
        public bool GeneralPromotionalEmails { get; set; }
        public bool NotificationsForFollowedProducts { get; set; }
    }
}
