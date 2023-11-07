using Core.Entities;

namespace Core.Services
{
    public interface ILookupDataService
    {
        Task<IReadOnlyList<ProductCategory>> GetProductCategoriesAsync();
        Task<IReadOnlyList<Store>> GetStoresAsync();
    }
}
