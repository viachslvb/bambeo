using System.Net;

namespace API.Models.ApiResponses
{
    public class ApiExceptionResponse : IApiResponse
    {
        public bool Success { get; private set; }
        public int StatusCode { get; set; }
        public string Message { get; set; }

        public ApiExceptionResponse(HttpStatusCode statusCode, string message = null)
        {
            Success = false;
            StatusCode = (int) statusCode;
            Message = message ?? GetDefaultMessageForStatusCode(statusCode);
        }

        private string GetDefaultMessageForStatusCode(HttpStatusCode statusCode)
        {
            switch (statusCode)
            {
                case HttpStatusCode.BadRequest:
                    return "Przepraszamy, ale Twoje żądanie nie może zostać zrealizowane. Proszę sprawdzić wprowadzone dane.";

                case HttpStatusCode.Unauthorized:
                    return "Brak autoryzacji. Aby uzyskać dostęp, zaloguj się na swoje konto.";

                case HttpStatusCode.Forbidden:
                    return "Przepraszamy, nie masz wystarczających uprawnień do wykonania tej operacji.";

                case HttpStatusCode.NotFound:
                    return "Przepraszamy, ale nie udało się odnaleźć żądanego zasobu.";

                case HttpStatusCode.InternalServerError:
                    return "Wystąpił nieoczekiwany błąd serwera. Proszę spróbować ponownie później.";

                default:
                    return "Wystąpił nieznany błąd. Prosimy o kontakt z obsługą techniczną.";
            }
        }
    }
}
