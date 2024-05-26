using Core.Interfaces;
using Core.Interfaces.Repositories;
using Hangfire;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data.Repositories;
using Application.Interfaces;
using Application.Services;
using API.Responses;
using Application.Enums;

namespace API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            // Add services to the container.
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(config.GetConnectionString("DefaultConnection")));

            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped(typeof(ISpecificationRepository<>), typeof(SpecificationRepository<>));
            services.AddScoped<IUserSettingsRepository, UserSettingsRepository>();
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            services.AddScoped<ICategoryRepository,  CategoryRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IFavoriteProductRepository, FavoriteProductRepository>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IStoreService, StoreService>();
            services.AddScoped<IPromotionService, PromotionService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IFavoriteProductService, FavoriteProductService>();

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            // Email extensions
            services
               .AddFluentEmail(config["EmailSettings:SenderEmail"], config["EmailSettings:SenderName"])
               .AddRazorRenderer()
               .AddSendGridSender(config["EmailSettings:SendGridApiKey"]);

            services.AddSingleton<IEmailTemplateService, EmailTemplateService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IEmailBackgroundTasks, EmailBackgroundTasks>();

            // Hangfire extensions
            // Add Hangfire services.
            services.AddHangfire(configuration => configuration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSqlServerStorage(config.GetConnectionString("DefaultConnection")));

            // Add the processing server as IHostedService
            services.AddHangfireServer();

            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    var errors = actionContext.ModelState
                        .Where(e => e.Value.Errors.Count > 0)
                        .SelectMany(x => x.Value.Errors)
                        .Select(x => x.ErrorMessage).ToArray();

                    var errorResponse = new ApiValidationErrorResponse(ErrorCode.ValidationFailed)
                    {
                        Errors = errors
                    };

                    return new BadRequestObjectResult(errorResponse);
                };
            });
            
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.WithOrigins(config["ClientUrl"])
                                      .AllowAnyHeader()
                                      .AllowCredentials()
                                      .AllowAnyMethod());
            });

            return services;
        }   
    }
}
