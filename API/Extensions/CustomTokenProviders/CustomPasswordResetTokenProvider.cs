using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace API.Extensions.CustomTokenProviders
{
    public class CustomPasswordResetTokenProvider<TUser> : DataProtectorTokenProvider<TUser> where TUser : class
    {
        public CustomPasswordResetTokenProvider(IDataProtectionProvider dataProtectionProvider,
            IOptions<PasswordResetProviderOptions> options,
            ILogger<DataProtectorTokenProvider<TUser>> logger)
            : base(dataProtectionProvider, options, logger)
        {
        }
    }

    public class PasswordResetProviderOptions : DataProtectionTokenProviderOptions
    {
        public PasswordResetProviderOptions()
        {
            TokenLifespan = TimeSpan.FromHours(3);
        }
    }
}
