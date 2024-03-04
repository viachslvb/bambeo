using API.Models.ApiResponses;
using API.Models.Enums;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace API.Controllers
{
    public class BuggerController : BaseApiController
    {
        private readonly ApplicationDbContext _context;
        public BuggerController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("servererror")]
        public ActionResult GetServerError()
        {
            var thing = _context.Promotions.Find(42);

            var thingToReturn = thing.ToString();
            return Ok();
        }

        [HttpGet("badrequest")]
        public ActionResult GetBadRequest()
        {
            return BadRequest(new ApiExceptionResponse());
        }

        [HttpGet("testauth")]
        [Authorize]
        public ActionResult<string> GetSecret()
        {
            return "this is secret stuff.";
        }
    }
}
