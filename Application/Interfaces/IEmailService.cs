using Core.Common.Helpers;

namespace Application.Interfaces
{
    public interface IEmailService
    {
        Task<EResult<bool>> SendEmailAsync(string to, string subject, string content, string senderEmail = null, string senderName = null, string tag = null);
    }
}