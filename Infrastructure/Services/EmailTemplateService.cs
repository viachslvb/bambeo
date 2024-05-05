using Application.Interfaces;
using FluentEmail.Core;
using System.Reflection;

namespace Infrastructure.Services
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
                $"Infrastructure.Data.EmailTemplates.{templateName}.cshtml",
                model,
                typeof(EmailTemplateService).GetTypeInfo().Assembly)
                .Data.Body;

            return content;
        }
    }
}
