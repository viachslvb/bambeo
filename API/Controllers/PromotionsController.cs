using API.Models.ApiResponses;
using API.Models.Dtos;
using API.Models.Enums;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;
using System.Net;

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
        //[HttpGet]
        //public async Task<ActionResult<List<Promotion>>> GetPromotions([FromQuery] PromotionSpecParams promotionParams)
        //{
        //    var spec = new PromotionsWithFiltersSpecification(promotionParams);
        //    var countSpec = new PromotionsWithFiltersForCountSpecification(promotionParams);

        //    var totalItems = await _promotionsRepo.CountAsync(countSpec);
        //    var promotions = await _promotionsRepo.ListAsync(spec);

        //    var data = _mapper.Map<IReadOnlyList<PromotionToReturnDto>>(promotions);

        //    return Ok(new Pagination<PromotionToReturnDto>(promotionParams.PageIndex,
        //        promotionParams.PageSize, totalItems, data));
        //}

        [HttpPost]
        public async Task<ActionResult<List<Promotion>>> GetPromotions([FromBody] PromotionSpecParams promotionParams)
        {
            var spec = new PromotionsWithFiltersSpecification(promotionParams);
            var countSpec = new PromotionsWithFiltersForCountSpecification(promotionParams);

            var totalItems = await _promotionsRepo.CountAsync(countSpec);
            var promotions = await _promotionsRepo.ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<PromotionDto>>(promotions);

            return Ok(new ApiResponse<PaginationResponse<PromotionDto>>
            (
                new PaginationResponse<PromotionDto>(
                    promotionParams.PageIndex,
                    promotionParams.PageSize, 
                    totalItems, 
                    data)
            ));;
        }

        // GET api/promotions/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PromotionDto>> GetPromotion(int id)
        {
            var spec = new PromotionsWithFiltersSpecification(id);
            var promotion = await _promotionsRepo.GetEntityWithSpec(spec);

            if (promotion == null) return NotFound(new ApiExceptionResponse(HttpStatusCode.NotFound));

            return Ok(new ApiResponse<PromotionDto>
            (
                _mapper.Map<PromotionDto>(promotion)
            ));
        }
        
    }
}