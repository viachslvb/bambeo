using Core.Entities;

namespace Core.Interfaces.Repositories
{
    public interface ICategoryRepository
    {
        Task<IReadOnlyList<ProductCategory>> GetCategoriesWithSubCategoriesAsync();
    }
}
