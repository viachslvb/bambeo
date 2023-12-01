using API.Models.Enums;
using System.Net;

namespace API.Models.ApiResponses
{
    public class ApiValidationErrorResponse : ApiErrorResponse
    {
        public ApiValidationErrorResponse(HttpStatusCode statusCode, ApiErrorCode errorCode)
            : base(statusCode, errorCode)
        {
        }

        public IEnumerable<string> Errors { get; set; }
    }
}
