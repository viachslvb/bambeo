using Application.Enums;
using Application.Helpers;
using Application.Interfaces;
using Application.Models;
using Application.Models.Dtos.Promotion;
using AutoMapper;
using Core.Entities;
using Core.Interfaces.Repositories;
using Core.Specifications;

namespace Application.Services
{
    public class PromotionService : IPromotionService
    {
        private readonly ISpecificationRepository<Promotion> _promotionsRepo;
        private readonly ICategoryService _categoryService;
        private readonly IMapper _mapper;

        public PromotionService(ISpecificationRepository<Promotion> promotionsRepo, ICategoryService categoryService, IMapper mapper)
        {
            _promotionsRepo = promotionsRepo;
            _categoryService = categoryService;
            _mapper = mapper;
        }

        public async Task<ServiceResult<PromotionDto>> GetPromotionById(int id)
        {
            var spec = new PromotionsWithFiltersSpecification(id);
            var promotion = await _promotionsRepo.GetEntityWithSpec(spec);

            if (promotion == null)
            {
                return ServiceResult<PromotionDto>.FailureResult(ErrorCode.NotFound);
            }

            PromotionDto promotionDto = _mapper.Map<Promotion, PromotionDto>(promotion);
            return ServiceResult<PromotionDto>.SuccessResult(promotionDto);
        }

        public async Task<ServiceResult<PageableCollection<PromotionDto>>> GetPromotionsWithSpec(PromotionSpecParamsDto promotionSpecParamsDto)
        {
            var promotionSpecParams = _mapper.Map<PromotionSpecParams>(promotionSpecParamsDto);

            var categories = _categoryService.GetCategories();
            var expandedCategoryIds = _categoryService.GetAllCategoryIdsIncludingSubCategories(promotionSpecParams.CategoryIds.ToList(), categories.Result.Data);
            promotionSpecParams.CategoryIds = expandedCategoryIds;

            var countSpec = new PromotionsWithFiltersForCountSpecification(promotionSpecParams);

            var totalItems = await _promotionsRepo.CountAsync(countSpec);
            var totalPages = (int)Math.Ceiling((double)totalItems / promotionSpecParams.PageSize);

            if (promotionSpecParams.PageIndex > totalPages && totalPages > 0)
            {
                promotionSpecParams.PageIndex = totalPages;
            }

            var hasNextPage = promotionSpecParams.PageIndex < totalPages;
            var hasPreviousPage = promotionSpecParams.PageIndex > 1;

            var spec = new PromotionsWithFiltersSpecification(promotionSpecParams);
            var promotions = await _promotionsRepo.ListAsync(spec);
            var promotionsDto = _mapper.Map<IReadOnlyList<PromotionDto>>(promotions);

            PageableCollection<PromotionDto> promotionsPageableCollection = new(
                promotionSpecParams.PageIndex,
                promotionSpecParams.PageSize,
                totalItems,
                promotionsDto,
                hasNextPage,
                hasPreviousPage
            );

            return ServiceResult<PageableCollection<PromotionDto>>.SuccessResult(promotionsPageableCollection);
        }
    }
}
