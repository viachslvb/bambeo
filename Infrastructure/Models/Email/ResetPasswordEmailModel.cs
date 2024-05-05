namespace Infrastructure.Models.Email
{
    public class ResetPasswordEmailModel
    {
        public string Firstname { get; set; }
        public string ResetPasswordLink { get; set; }
    }
}
