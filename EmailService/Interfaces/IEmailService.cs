namespace Mailer.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string content, string? senderEmail = null, string? senderName = null, string? tag = null);
    }
}
