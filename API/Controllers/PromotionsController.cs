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

        [HttpGet]
        public async Task<ActionResult<List<PromotionDto>>> GetPromotions([FromQuery] PromotionSpecParamsDto promotionSpecParamsDto)
        {
            ServiceResult<PageableCollection<PromotionDto>> result = await _promotionService.GetPromotionsWithSpec(promotionSpecParamsDto);

            return Ok(new ApiResponse<PageableCollection<PromotionDto>>(result.Data));
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<PromotionDto>>> GetPromotionsPost([FromBody] PromotionSpecParamsDto promotionSpecParamsDto)
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