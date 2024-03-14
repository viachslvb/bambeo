using FluentEmail.Core;
using Mailer.Exceptions;
using Mailer.Interfaces;
using Microsoft.Extensions.Logging;

namespace Mailer.Services
{
    public class EmailService : IEmailService
    {
        private readonly IFluentEmail _fluentEmail;

        public EmailService(IFluentEmail fluentEmail)
        {
            _fluentEmail = fluentEmail;
        }

        public async Task SendEmailAsync(string to, string subject, string content, string? senderEmail = null, string? senderName = null, string? tag = null)
        {
            tag ??= "Other";

            var email = _fluentEmail
                .To(to)
                .Subject(subject)
                .Tag(tag)
                .Body(content, isHtml: true);

            if (senderEmail != null)
            {
                email.SetFrom(senderEmail, senderName ?? "");
            }

            var sendResponse = await email.SendAsync();
            
            if (!sendResponse.Successful) {
                string errorMessage = $"Failed to send an email. Errors: {string.Join(Environment.NewLine, sendResponse.ErrorMessages)}";

                throw new EmailSendingException(errorMessage);
            }
        }
    }
}
