using API.Extensions;
using API.Helpers;
using API.Responses;
using Application.Helpers;
using Application.Interfaces;
using Application.Models.Dtos.FavoriteProduct;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FavoritesController : BaseApiController
    {
        private readonly IFavoriteProductService _favoritesService;
        private readonly ILogger<FavoritesController> _logger;

        public FavoritesController(IFavoriteProductService favoritesService, ILogger<FavoritesController> logger)
        {
            _favoritesService = favoritesService;
            _logger = logger;
        }

        // GET: api/favorites
        [Authorize]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<ApiResponse<FavoriteProductResponseDto>>> GetFavorites()
        {
            ServiceResult<FavoriteProductResponseDto> result = await _favoritesService.GetUserFavoritesAsync(User.GetUserId());

            return Ok(new ApiResponse<FavoriteProductResponseDto>(result.Data));
        }

        // POST: api/favorites/{productId}
        [Authorize]
        [HttpPost("{productId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddToFavorites(int productId)
        {
            ServiceResult<bool> result = await _favoritesService.AddToFavoritesAsync(User.GetUserId(), productId);

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            return NoContent();
        }

        // DELETE: api/favorites/{productId}
        [Authorize]
        [HttpDelete("{productId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RemoveFromFavorites(int productId)
        {
            ServiceResult<bool> result = await _favoritesService.RemoveFromFavoritesAsync(User.GetUserId(), productId);

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            return NoContent();
        }
    }
}
