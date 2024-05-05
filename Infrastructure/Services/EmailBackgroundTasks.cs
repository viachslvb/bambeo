using Application.Interfaces;
using Core.Common.Helpers;
using Core.Entities.Identity;
using Hangfire;
using Infrastructure.Models.Email;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text;

namespace Infrastructure.Services
{
    public class EmailBackgroundTasks : IEmailBackgroundTasks
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _config;
        private readonly ILogger<EmailBackgroundTasks> _logger;
        private readonly IEmailService _emailService;
        private readonly IEmailTemplateService _templateService;

        public EmailBackgroundTasks(UserManager<AppUser> userManager, IConfiguration config, ILogger<EmailBackgroundTasks> logger,
            IEmailService emailService, IEmailTemplateService emailTemplateService)
        {
            _userManager = userManager;
            _config = config;
            _emailService = emailService;
            _logger = logger;
            _templateService = emailTemplateService;
        }

        public void SendWelcomeEmail(string userId)
        {
            BackgroundJob.Enqueue(() => SendWelcomeEmailAsync(userId));
        }

        public void SendVerificationLinkEmail(string userId)
        {
            BackgroundJob.Enqueue(() => SendVerificationLinkEmailAsync(userId));
        }

        public void SendResetPasswordEmail(string userId)
        {
            BackgroundJob.Enqueue(() => SendResetPasswordEmailAsync(userId));
        }

        public void SendChangePasswordEmail(string userId)
        {
            BackgroundJob.Enqueue(() => SendChangePasswordEmailAsync(userId));
        }

        public async Task SendWelcomeEmailAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogError($"User with ID '{userId}' is not found.");
                    return;
                }

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);
                var tokenEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);

                var clientUrl = _config["ClientUrl"];
                var callbackUrl = $"{clientUrl}/account/confirm-email?userId={user.Id}&token={tokenEncoded}";

                string subject = "Zweryfikuj swój adres email";

                var welcomeEmailModel = new WelcomeEmailModel
                {
                    Firstname = user.DisplayName,
                    ConfirmationLink = callbackUrl
                };
                var content = _templateService.GenerateContent("WelcomeEmail", welcomeEmailModel);

                EResult<bool> result = await _emailService.SendEmailAsync(user.Email, subject, content, tag: "Welcome Mails");
                
                if (!result.Success)
                {
                    throw new Exception(result.ErrorMessage);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while sending the welcome email: {ex.Message}");
                throw;
            }
        }

        public async Task SendVerificationLinkEmailAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogError($"User with ID '{userId}' is not found.");
                    return;
                }

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);
                var tokenEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);

                var clientUrl = _config["ClientUrl"];
                var callbackUrl = $"{clientUrl}/account/confirm-email?userId={user.Id}&token={tokenEncoded}";

                string subject = "Potwierdzenie adresu e-mail";

                var verificationLinkEmailModel = new VerificationLinkEmailModel
                {
                    Firstname = user.DisplayName,
                    ConfirmationLink = callbackUrl
                };
                var content = _templateService.GenerateContent("VerificationLinkEmail", verificationLinkEmailModel);
                
                EResult<bool> result = await _emailService.SendEmailAsync(user.Email, subject, content, tag: "Verification Link Mails");
                if (!result.Success)
                {
                    throw new Exception(result.ErrorMessage);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while sending the verification link email: {ex.Message}");
                throw;
            }
        }

        public async Task SendResetPasswordEmailAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogError($"User with ID '{userId}' is not found.");
                    return;
                }

                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);
                var tokenEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);

                var clientUrl = _config["ClientUrl"];
                var callbackUrl = $"{clientUrl}/account/password-reset?userId={user.Id}&token={tokenEncoded}";

                string subject = "Resetowanie hasła";

                var passwordResetEmailModel = new ResetPasswordEmailModel
                {
                    Firstname = user.DisplayName,
                    ResetPasswordLink = callbackUrl
                };
                var content = _templateService.GenerateContent("PasswordResetEmail", passwordResetEmailModel);
                
                EResult<bool> result = await _emailService.SendEmailAsync(user.Email, subject, content, tag: "Password Reset Mails");
                if (!result.Success)
                {
                    throw new Exception(result.ErrorMessage);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while sending the password reset email: {ex.Message}");
                throw;
            }
        }

        public async Task SendChangePasswordEmailAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogError($"User with ID '{userId}' is not found.");
                    return;
                }

                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);
                var tokenEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);

                var clientUrl = _config["ClientUrl"];
                var callbackUrl = $"{clientUrl}/account/change-password?userId={user.Id}&token={tokenEncoded}";

                string subject = "Zmiana hasła";

                var changePasswordModel = new ChangePasswordEmailModel
                {
                    Firstname = user.DisplayName,
                    ChangePasswordLink = callbackUrl
                };
                var content = _templateService.GenerateContent("ChangePasswordEmail", changePasswordModel);
                
                EResult<bool> result = await _emailService.SendEmailAsync(user.Email, subject, content, tag: "Change Password Mails");
                if (!result.Success)
                {
                    throw new Exception(result.ErrorMessage);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while sending the password reset email: {ex.Message}");
                throw;
            }
        }
    }
}
