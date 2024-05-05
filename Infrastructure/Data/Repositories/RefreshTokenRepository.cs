using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly ApplicationDbContext _context;

        public RefreshTokenRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RefreshToken> GetByTokenAsync(string token)
        {
            return await _context.RefreshTokens
                .Include(rt => rt.User)
                .SingleOrDefaultAsync(rt => rt.Token == token);
        }

        public async Task UpdateAsync(RefreshToken token)
        {
            _context.RefreshTokens.Update(token);
            await _context.SaveChangesAsync();
        }

        public async Task<RefreshToken> CreateAsync(RefreshToken token)
        {
            await _context.RefreshTokens.AddAsync(token);
            await _context.SaveChangesAsync();

            return token;
        }

        public async Task<IReadOnlyList<RefreshToken>> GetActiveByUserIdAsync(string userId)
        {
            var tokens = await _context.RefreshTokens
                                   .Where(rt => rt.UserId == userId && rt.Revoked == null)
                                   .ToListAsync();

            return tokens.AsReadOnly();
        }

        public async Task<IReadOnlyList<RefreshToken>> GetAllByUserIdAsync(string userId)
        {
            var tokens = await _context.RefreshTokens
                                   .Where(rt => rt.UserId == userId)
                                   .ToListAsync();

            return tokens.AsReadOnly();
        }

        public async Task DeleteAllAsync(IEnumerable<RefreshToken> tokens)
        {
            _context.RefreshTokens.RemoveRange(tokens);
            await _context.SaveChangesAsync();
        }
    }
}
