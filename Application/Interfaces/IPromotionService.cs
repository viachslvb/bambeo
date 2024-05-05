using Application.Helpers;
using Application.Models.Dtos;
using Application.Models;

namespace Application.Interfaces
{
    public interface IPromotionService
    {
        Task<ServiceResult<PromotionDto>> GetPromotionById(int id);
        Task<ServiceResult<PageableCollection<PromotionDto>>> GetPromotionsWithSpec(PromotionSpecParamsDto promotionSpecParamsDto);
    }
}