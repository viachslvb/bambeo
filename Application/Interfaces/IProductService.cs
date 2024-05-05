using Application.Helpers;
using Application.Models;
using Application.Models.Dtos;

namespace Application.Interfaces
{
    public interface IProductService
    {
        Task<ServiceResult<ProductDto>> GetProductById(int id);
        Task<ServiceResult<PageableCollection<ProductDto>>> GetProductsWithSpec(ProductSpecParamsDto productSpecParamsDto);
    }
}
