using Application.Helpers;
using Application.Models.Dtos.Product;

namespace Application.Interfaces
{
    public interface IProductService
    {
        Task<ServiceResult<ProductInfoDto>> GetProductById(int id);
    }
}
