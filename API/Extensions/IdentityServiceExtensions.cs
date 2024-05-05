using Core.Entities.Identity;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using API.Extensions.CustomTokenProviders;
using API.Responses;
using Application.Enums;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services,
            IConfiguration config)
        {
            services.AddIdentityCore<AppUser>(options =>
            {
                options.SignIn.RequireConfirmedAccount = false;
                options.Tokens.EmailConfirmationTokenProvider = "EmailConfirmation";
                options.Tokens.PasswordResetTokenProvider = "PasswordReset";
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddSignInManager<SignInManager<AppUser>>()
            .AddDefaultTokenProviders()
            .AddTokenProvider<CustomEmailConfirmationTokenProvider<AppUser>>("EmailConfirmation")
            .AddTokenProvider<CustomPasswordResetTokenProvider<AppUser>>("PasswordReset");

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

                            var apiResponse = new ApiErrorResponse(ErrorCode.AuthorizationRequired);

                            if (context.Error == "invalid_token" && context.ErrorDescription.Contains("The token expired"))
                            {
                                apiResponse = new ApiErrorResponse(ErrorCode.AccessTokenExpired);
                            }
                            else if (context.Error == "invalid_token")
                            {
                                apiResponse = new ApiErrorResponse(ErrorCode.InvalidAccessToken);
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