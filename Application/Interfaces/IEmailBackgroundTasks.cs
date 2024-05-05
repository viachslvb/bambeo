namespace Application.Interfaces
{
    public interface IEmailBackgroundTasks
    {
        void SendWelcomeEmail(string userId);
        void SendVerificationLinkEmail(string userId);
        void SendResetPasswordEmail(string userId);
        void SendChangePasswordEmail(string userId);
    }
}