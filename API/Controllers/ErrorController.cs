using API.Models.ApiResponses;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace API.Controllers
{
    [Route("errors/{code}")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorController : BaseApiController
    {
        public IActionResult Error()
        {
            return new ObjectResult(new ApiExceptionResponse());
        }
    }
}
