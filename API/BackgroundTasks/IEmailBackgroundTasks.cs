namespace API.BackgroundTasks
{
    public interface IEmailBackgroundTasks
    {
        Task SendWelcomeEmailAsync(string userId);
        Task SendPasswordResetEmailAsync(string userId);
    }
}