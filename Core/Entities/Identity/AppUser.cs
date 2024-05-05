using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class AppUser : IdentityUser
    {
        public DateTime CreatedAt { get; set; }
        public string DisplayName { get; set; }
        public virtual UserSettings Settings { get; set; }
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new HashSet<RefreshToken>();
    }
}
