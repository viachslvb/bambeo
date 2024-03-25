using Core.Entities.Identity;

namespace Core.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
        Task<RefreshToken> GenerateRefreshTokenAsync(AppUser user, string ipAddress);
        Task<RefreshToken> GetRefreshTokenAsync(string token);
        Task RevokeRefreshTokenAsync(RefreshToken refreshToken, string ipAddress);
        Task RevokeAllRefreshTokensByUserIdAsync(string userId, string ipAddress);
    }
}
