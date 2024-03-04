using API.Models.Enums;
using System.Net;

namespace API.Models.ApiResponses
{
    public class ApiValidationErrorResponse : ApiErrorResponse
    {
        public ApiValidationErrorResponse(ApiErrorCode errorCode)
            : base(errorCode)
        {
        }

        public IEnumerable<string> Errors { get; set; }
    }
}
