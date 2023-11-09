using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggerController : BaseApiController
    {
        private readonly PromotionContext _context;
        public BuggerController(PromotionContext context)
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
            return BadRequest(new ApiResponse(400));
        }
    }
}
