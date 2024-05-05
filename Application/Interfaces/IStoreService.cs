using Application.Helpers;
using Application.Models.Dtos;

namespace Application.Interfaces
{
    public interface IStoreService
    {
        Task<ServiceResult<IReadOnlyList<StoreDto>>> GetStores();
    }
}
