using Application.Enums;
using Application.Helpers;
using Application.Interfaces;
using Application.Models.Dtos.FavoriteProduct;
using AutoMapper;
using Core.Interfaces.Repositories;

namespace Application.Services
{
    public class FavoriteProductService : IFavoriteProductService
    {
        private readonly IFavoriteProductRepository _favoritesRepository;
        private readonly IMapper _mapper;

        public FavoriteProductService(IFavoriteProductRepository favoritesRepository, IMapper mapper)
        {
            _favoritesRepository = favoritesRepository;
            _mapper = mapper;
        }
        
        public async Task<ServiceResult<FavoriteProductResponseDto>> GetUserFavoritesAsync(string userId)
        {
            var favorites = await _favoritesRepository.GetUserFavoritesAsync(userId);
            var favoriteDtos = _mapper.Map<IReadOnlyList<FavoriteProductDto>>(favorites);
            var sortedFavoriteDtos = favoriteDtos.OrderByDescending(dto => dto.HasPromotion)
                                                 .ThenByDescending(p => p.CreatedAt)
                                                 .ToList();

            var promotionCount = sortedFavoriteDtos.Count(p => p.HasPromotion);

            var response = new FavoriteProductResponseDto
            {
                Products = sortedFavoriteDtos,
                PromotionCount = promotionCount
            };

            return ServiceResult<FavoriteProductResponseDto>.SuccessResult(response);
        }
        
        public async Task<ServiceResult<bool>> AddToFavoritesAsync(string userId, int productId)
        {
            if (await _favoritesRepository.IsFavoriteAsync(userId, productId))
            {
                return ServiceResult<bool>.FailureResult(ErrorCode.ProductAlreadyFavorited);
            }

            await _favoritesRepository.AddToFavoritesAsync(userId, productId);
            return ServiceResult<bool>.SuccessResult(true);
        }

        public async Task<ServiceResult<bool>> RemoveFromFavoritesAsync(string userId, int productId)
        {
            if (!await _favoritesRepository.IsFavoriteAsync(userId, productId))
            {
                return ServiceResult<bool>.FailureResult(ErrorCode.ProductNotFavorited);
            }

            await _favoritesRepository.RemoveFromFavoritesAsync(userId, productId);
            return ServiceResult<bool>.SuccessResult(true);
        }
    }
}
