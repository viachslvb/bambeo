namespace Application.Models.Dtos
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
