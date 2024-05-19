using Application.Helpers;
using Application.Models;
using Application.Models.Dtos.Promotion;

namespace Application.Interfaces
{
    public interface IPromotionService
    {
        Task<ServiceResult<PromotionDto>> GetPromotionById(int id);
        Task<ServiceResult<PageableCollection<PromotionDto>>> GetPromotionsWithSpec(PromotionSpecParamsDto promotionSpecParamsDto);
    }
}