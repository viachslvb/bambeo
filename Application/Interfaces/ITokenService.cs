using Core.Entities;
using Core.Entities.Identity;

namespace Application.Interfaces
{
    public interface ITokenService
    {
        string CreateAccessToken(AppUser user);
        Task<RefreshToken> GenerateTokenAsync(AppUser user, string ipAddress, bool extendedExpiry = false);
        Task<RefreshToken> GetTokenAsync(string token);
        Task<RefreshToken> UpdateToken(RefreshToken token, string ipAddress);
        Task RevokeTokenAsync(RefreshToken refreshToken, string ipAddress);
        Task RevokeAllTokensByUserIdAsync(string userId, string ipAddress);
    }
}
