using API.Models.ApiResponses;
using API.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace API.Extensions
{
    public class DisallowAuthenticatedAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // Access the IConfiguration service from the HttpContext
            var config = context.HttpContext.RequestServices.GetService<IConfiguration>();

            // Check if the request has an Authorization header
            if (context.HttpContext.Request.Headers.ContainsKey("Authorization"))
            {
                var token = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

                if (token != null)
                {
                    var tokenHandler = new JwtSecurityTokenHandler();

                    try
                    {
                        // Validate the token
                        tokenHandler.ValidateToken(token, new TokenValidationParameters
                        {
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])),
                            ValidIssuer = config["Token:Issuer"],
                            ValidateIssuer = true,
                            ValidateAudience = false,
                            ValidateLifetime = true,
                            ClockSkew = TimeSpan.Zero
                        }, out SecurityToken validatedToken);

                        // If token is valid, set a response indicating the user is already logged in
                        context.Result = new BadRequestObjectResult(new ApiErrorResponse(ApiErrorCode.AlreadyAuthenticated));
                    }
                    catch
                    {
                        // Token is not valid, which means it's not an authenticated request
                        // No action needed here, let the request proceed
                    }
                }
            }

            base.OnActionExecuting(context);
        }
    }
}
