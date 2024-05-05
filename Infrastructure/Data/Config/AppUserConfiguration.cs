using Core.Entities;
using Core.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
    {
        public void Configure(EntityTypeBuilder<AppUser> builder)
        {
            // Configure one-to-one relationship with UserSettings
            builder.HasOne(u => u.Settings)
                   .WithOne(s => s.User)
                   .HasForeignKey<UserSettings>(s => s.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Configure many-to-one relationship with RefreshToken
            builder.HasMany(u => u.RefreshTokens)
                    .WithOne(rt => rt.User)
                    .HasForeignKey(rt => rt.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
