using API.Helpers;
using Application.Enums;

namespace API.Responses
{
    public class ApiErrorResponse : ApiExceptionResponse
    {
        public ErrorCode ErrorCode { get; set; }

        public ApiErrorResponse(ErrorCode errorCode, string message = null) : base(message)
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
