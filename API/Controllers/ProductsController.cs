using Microsoft.AspNetCore.Mvc;
using API.Responses;
using Application.Models;
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

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<PageableCollection<ProductDto>>> GetProducts([FromQuery] ProductSpecParamsDto productSpecParamsDto)
        {
            ServiceResult<PageableCollection<ProductDto>> result = await _productService.GetProductsWithSpec(productSpecParamsDto);

            return Ok(new ApiResponse<PageableCollection<ProductDto>>(result.Data));
        }
        
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            ServiceResult<ProductDto> result = await _productService.GetProductById(id);

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            return Ok(new ApiResponse<ProductDto>(result.Data));
        }
    }
}