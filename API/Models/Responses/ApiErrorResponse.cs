using API.Models.Enums;
using System.Net;

namespace API.Models.ApiResponses
{
    public class ApiErrorResponse : ApiExceptionResponse
    {
        public ApiErrorCode ErrorCode { get; set; }

        public ApiErrorResponse(ApiErrorCode errorCode, string message = null) : base(message)
        {
            ErrorCode = errorCode;
            
            if (string.IsNullOrEmpty(message))
            {
                var errorMessage = ErrorMessages.GetErrorMessage(errorCode);
                if (!string.IsNullOrEmpty(errorMessage))
                {
                    Message = errorMessage;
                }
            }
        }
    }
}
