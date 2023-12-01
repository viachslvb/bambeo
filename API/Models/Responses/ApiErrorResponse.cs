using API.Models.Enums;
using System.Net;

namespace API.Models.ApiResponses
{
    public class ApiErrorResponse : ApiExceptionResponse
    {
        public ApiErrorCode ErrorCode { get; set; }

        public ApiErrorResponse(HttpStatusCode statusCode, ApiErrorCode errorCode, string message = null) : base(statusCode, message)
        {
            ErrorCode = errorCode;
            
            if (string.IsNullOrEmpty(message))
            {
                Console.WriteLine($"Error code: {errorCode}");
                var errorMessage = ErrorMessages.GetErrorMessage(errorCode);
                Console.WriteLine($"Error code: {errorMessage}");
                if (!string.IsNullOrEmpty(errorMessage))
                {
                    Message = errorMessage;
                    Console.WriteLine($"Error code: {Message}");
                }
            }
        }
    }
}
