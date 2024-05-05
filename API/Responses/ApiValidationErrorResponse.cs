using Application.Enums;

namespace API.Responses
{
    public class ApiValidationErrorResponse : ApiErrorResponse
    {
        public ApiValidationErrorResponse(ErrorCode errorCode)
            : base(errorCode)
        {
        }

        public IEnumerable<string> Errors { get; set; }
    }
}