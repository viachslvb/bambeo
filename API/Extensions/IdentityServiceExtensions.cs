using API.Models.ApiResponses;
using API.Models.Enums;
using Azure;
using Core.Entities.Identity;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.Text;
using System.Text.Json;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services,
            IConfiguration config)
        {
            services.AddIdentityCore<AppUser>(opt =>
            {
                // add identity options here
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddSignInManager<SignInManager<AppUser>>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])),
                        ValidIssuer = config["Token:Issuer"],
                        ValidateIssuer = true,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnChallenge = context =>
                        {
                            context.HandleResponse();

                            var apiResponse = new ApiErrorResponse(ApiErrorCode.AuthorizationRequired);

                            if (context.Error == "invalid_token" && context.ErrorDescription.Contains("The token expired"))
                            {
                                apiResponse = new ApiErrorResponse(ApiErrorCode.AccessTokenExpired);
                            }
                            else if (context.Error == "invalid_token")
                            {
                                apiResponse = new ApiErrorResponse(ApiErrorCode.InvalidAccessToken);
                            }

                            context.Response.ContentType = "application/json";
                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;

                            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                            var json = JsonSerializer.Serialize(apiResponse, options);

                            return context.Response.WriteAsync(json);
                        }
                    };
                });

            services.AddAuthorization();

            return services;
        }
    }
}
