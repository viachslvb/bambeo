namespace API.BackgroundTasks
{
    public interface IEmailBackgroundTasks
    {
        Task SendWelcomeEmailAsync(string userId);
    }
}