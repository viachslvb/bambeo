using FluentEmail.Core;
using Mailer.Interfaces;
using System.Reflection;

namespace Mailer.Services
{
    public class EmailTemplateService : IEmailTemplateService
    {
        private readonly IFluentEmailFactory _emailFactory;

        public EmailTemplateService(IFluentEmailFactory emailFactory)
        {
            _emailFactory = emailFactory;
        }

        public string GenerateContent<T>(string templateName, T model)
        {
            var email = _emailFactory.Create();

            var content = email.UsingTemplateFromEmbedded(
                $"Mailer.Templates.{templateName}.cshtml", 
                model, 
                typeof(EmailService).GetTypeInfo().Assembly)
                .Data.Body;
            
            return content;
        }
    }
}
