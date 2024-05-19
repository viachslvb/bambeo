using Core.Entities;
using Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories
{
    public class FavoriteProductRepository : IFavoriteProductRepository
    {
        private readonly ApplicationDbContext _context;

        public FavoriteProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<FavoriteProduct>> GetUserFavoritesAsync(string userId)
        {
            return await _context.FavoriteProducts
                .Include(f => f.Product)
                    .ThenInclude(p => p.Promotions)
                .Include(f => f.Product)
                    .ThenInclude(p => p.Store)
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }

        public async Task AddToFavoritesAsync(string userId, int productId)
        {
            var favoriteProduct = new FavoriteProduct
            {
                CreatedAt = DateTime.UtcNow,
                UserId = userId,
                ProductId = productId
            };

            _context.FavoriteProducts.Add(favoriteProduct);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveFromFavoritesAsync(string userId, int productId)
        {
            var favoriteProduct = await _context.FavoriteProducts
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);

            if (favoriteProduct != null)
            {
                _context.FavoriteProducts.Remove(favoriteProduct);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> IsFavoriteAsync(string userId, int productId)
        {
            return await _context.FavoriteProducts.AnyAsync(f => f.UserId == userId && f.ProductId == productId);
        }
    }
}
