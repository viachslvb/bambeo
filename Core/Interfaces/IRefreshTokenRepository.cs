using Core.Entities.Identity;

namespace Core.Interfaces
{
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken> GetByTokenAsync(string token);
        Task UpdateTokenAsync(RefreshToken token);
        Task<RefreshToken> CreateTokenAsync(RefreshToken token);
        Task<IReadOnlyList<RefreshToken>> GetAllTokensByUserIdAsync(string userId);
    }
}
