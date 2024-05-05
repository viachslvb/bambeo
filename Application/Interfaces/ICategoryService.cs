using Application.Helpers;
using Application.Models.Dtos;

namespace Application.Interfaces
{
    public interface ICategoryService
    {
        Task<ServiceResult<List<ProductCategoryDto>>> GetCategories();
    }
}