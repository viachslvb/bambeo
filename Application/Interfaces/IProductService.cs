using Application.Helpers;
using Application.Models.Dtos;

namespace Application.Interfaces
{
    public interface IProductService
    {
        Task<ServiceResult<ProductInfoDto>> GetProductById(int id);
    }
}
