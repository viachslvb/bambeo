using API.Dtos;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PromotionsController : BaseApiController
    {
        private readonly IGenericRepository<Promotion> _promotionsRepo;
        private readonly IMapper _mapper;

        public PromotionsController(IGenericRepository<Promotion> promotionsRepo, IMapper mapper)
        {
            _promotionsRepo = promotionsRepo;
            _mapper = mapper;
        }

        // GET api/promotions
        [HttpGet]
        public async Task<ActionResult<List<Promotion>>> GetPromotions([FromQuery] PromotionSpecParams promotionParams)
        {
            var spec = new PromotionsWithFiltersSpecification(promotionParams);
            var countSpec = new PromotionsWithFiltersForCountSpecification(promotionParams);

            var totalItems = await _promotionsRepo.CountAsync(countSpec);
            var promotions = await _promotionsRepo.ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<PromotionToReturnDto>>(promotions);

            return Ok(new Pagination<PromotionToReturnDto>(promotionParams.PageIndex,
                promotionParams.PageSize, totalItems, data));
        }
    }
}