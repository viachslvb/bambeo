namespace Infrastructure.Models.Email
{
    public class VerificationLinkEmailModel
    {
        public string Firstname { get; set; }
        public string ConfirmationLink { get; set; }
    }
}