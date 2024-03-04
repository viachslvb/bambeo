using System.Net;

namespace API.Models.ApiResponses
{
    public class ApiExceptionResponse : IApiResponse
    {
        public bool Success { get; private set; }
        public string Message { get; set; }

        public ApiExceptionResponse(string message = null)
        {
            Success = false;
            Message = message ?? "Wystąpił nieznany błąd. Prosimy o kontakt z obsługą techniczną.";
        }
    }
}
