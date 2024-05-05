using Core.Entities;

namespace Core.Interfaces
{
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken> CreateAsync(RefreshToken token);
        Task<RefreshToken> GetByTokenAsync(string token);
        Task UpdateAsync(RefreshToken token);
        Task<IReadOnlyList<RefreshToken>> GetActiveByUserIdAsync(string userId);
        Task<IReadOnlyList<RefreshToken>> GetAllByUserIdAsync(string userId);
        Task DeleteAllAsync(IEnumerable<RefreshToken> tokens);
    }
}
