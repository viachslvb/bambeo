namespace Application.Interfaces
{
    public interface IEmailTemplateService
    {
        string GenerateContent<T>(string templateName, T model);
    }
}