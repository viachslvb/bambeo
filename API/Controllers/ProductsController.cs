using Microsoft.AspNetCore.Mvc;
using API.Responses;
using Application.Helpers;
using Application.Models.Dtos;
using Application.Interfaces;
using API.Helpers;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }
        
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductInfoDto>> GetProduct(int id)
        {
            ServiceResult<ProductInfoDto> result = await _productService.GetProductById(id);

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            return Ok(new ApiResponse<ProductInfoDto>(result.Data));
        }
    }
}