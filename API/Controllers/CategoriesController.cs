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
        public async Task<ActionResult<List<CategoryDto>>> GetCategories()
        {
            ServiceResult<List<CategoryDto>> result = await _categoryService.GetCategories();
            return Ok(new ApiResponse<List<CategoryDto>>(result.Data));
        }
    }
}
