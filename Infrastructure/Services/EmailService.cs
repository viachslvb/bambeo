using Application.Interfaces;
using Core.Common.Helpers;
using FluentEmail.Core;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IFluentEmail _fluentEmail;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IFluentEmail fluentEmail, ILogger<EmailService> logger)
        {
            _fluentEmail = fluentEmail;
            _logger = logger;
        }

        public async Task<EResult<bool>> SendEmailAsync(string to, string subject, string content, string senderEmail = null, string senderName = null, string tag = null)
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

            if (!sendResponse.Successful)
            {
                string errorMessage = $"Failed to send an email. Errors: {string.Join(Environment.NewLine, sendResponse.ErrorMessages)}";
                _logger.LogError(errorMessage);

                return EResult<bool>.Failure(errorMessage);
            }

            return EResult<bool>.SuccessResponse(true);
        }
    }
}
