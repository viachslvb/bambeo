using API.Responses;
using Application.Helpers;
using Application.Interfaces;
using Application.Models.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CategoriesController : BaseApiController
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET api/categories
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<ProductCategoryDto>>> GetCategories()
        {
            ServiceResult<List<ProductCategoryDto>> result = await _categoryService.GetCategories();
            return Ok(new ApiResponse<List<ProductCategoryDto>>(result.Data));
        }
    }
}
