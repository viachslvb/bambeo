using Application.Helpers;
using Application.Models.Dtos.FavoriteProduct;

namespace Application.Interfaces
{
    public interface IFavoriteProductService
    {
        Task<ServiceResult<FavoriteProductResponseDto>> GetUserFavoritesAsync(string userId);
        Task<ServiceResult<bool>> AddToFavoritesAsync(string userId, int productId);
        Task<ServiceResult<bool>> RemoveFromFavoritesAsync(string userId, int productId);
    }
}