using API.Helpers;
using API.Responses;
using Application.Helpers;
using Application.Interfaces;
using Application.Models;
using Application.Models.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PromotionsController : BaseApiController
    {
        private readonly IPromotionService _promotionService;

        public PromotionsController(IPromotionService promotionService)
        {
            _promotionService = promotionService;
        }
        
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<PromotionDto>>> GetPromotions([FromBody] PromotionSpecParamsDto promotionSpecParamsDto)
        {
            ServiceResult<PageableCollection<PromotionDto>> result = await _promotionService.GetPromotionsWithSpec(promotionSpecParamsDto);

            return Ok(new ApiResponse<PageableCollection<PromotionDto>>(result.Data));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PromotionDto>> GetPromotion(int id)
        {
            ServiceResult<PromotionDto> result = await _promotionService.GetPromotionById(id);

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            return Ok(new ApiResponse<PromotionDto>(result.Data));
        }
    }
}