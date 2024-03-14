using Core.Entities.Identity;
using Mailer.Interfaces;
using Mailer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using System.Web;

namespace API.BackgroundTasks
{
    public class EmailBackgroundTasks : IEmailBackgroundTasks
    {
        private readonly IEmailService _emailService;
        private readonly IEmailTemplateService _templateService;
        private readonly ILogger<EmailBackgroundTasks> _logger;
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;

        public EmailBackgroundTasks(UserManager<AppUser> userManager, IConfiguration config, IEmailService emailService, IEmailTemplateService emailTemplateService, ILogger<EmailBackgroundTasks> logger)
        {
            _userManager = userManager;
            _config = config;
            _emailService = emailService;
            _logger = logger;
            _templateService = emailTemplateService;
        }

        public async Task SendWelcomeEmailAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null) return;

                var emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(emailConfirmationToken);
                var tokenEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);

                var clientUrl = _config["ClientUrl"];
                var callbackUrl = $"{clientUrl}/account/confirm-email?userId={user.Id}&token={tokenEncoded}";

                string subject = "Zweryfikuj swój adres e-mail";
                
                var welcomeEmailModel = new WelcomeEmailModel
                {
                    Firstname = user.DisplayName,
                    ConfirmationLink = callbackUrl
                };
                var content = _templateService.GenerateContent("WelcomeEmail", welcomeEmailModel);

                await _emailService.SendEmailAsync(user.Email, subject, content, tag: "Welcome Mails");
            }
            catch(Exception ex)
            {
                _logger.LogError($"An error occurred while sending the email: {ex.Message}");
                throw;
            }
        }
    }
}
