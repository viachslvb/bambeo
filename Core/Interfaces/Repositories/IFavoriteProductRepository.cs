using Core.Entities;

namespace Core.Interfaces.Repositories
{
    public interface IFavoriteProductRepository
    {
        Task<IReadOnlyList<FavoriteProduct>> GetUserFavoritesAsync(string userId);
        Task AddToFavoritesAsync(string userId, int productId);
        Task RemoveFromFavoritesAsync(string userId, int productId);
        Task<bool> IsFavoriteAsync(string userId, int productId);
    }
}
