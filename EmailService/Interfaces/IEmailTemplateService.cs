namespace Mailer.Interfaces
{
    public interface IEmailTemplateService
    {
        string GenerateContent<T>(string templateName, T model);
    }
}
