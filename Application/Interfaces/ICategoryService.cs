using Application.Helpers;
using Application.Models.Dtos;

namespace Application.Interfaces
{
    public interface ICategoryService
    {
        Task<ServiceResult<List<CategoryDto>>> GetCategories();
        List<int> GetAllCategoryIdsIncludingSubCategories(List<int> categoryIds, List<CategoryDto> allCategories);
    }
}