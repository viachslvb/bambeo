using System.ComponentModel.DataAnnotations;

namespace Core.Entities.Identity
{
    public class RefreshToken : BaseEntity
    {
        public string Token { get; set; }
        public DateTime Expires { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public DateTime Created { get; set; }
        public string CreatedByIp { get; set; }
        public DateTime? Revoked { get; set; }
        public string RevokedByIp { get; set; }
        public bool RememberMe { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;
        public AppUser User { get; set; }
        public string UserId { get; set; }
    }
}
