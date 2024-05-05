namespace Infrastructure.Models.Email
{
    public class WelcomeEmailModel
    {
        public string Firstname { get; set; }
        public string ConfirmationLink { get; set; }
    }
}