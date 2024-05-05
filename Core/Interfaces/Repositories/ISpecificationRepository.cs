using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces.Repositories
{
    public interface ISpecificationRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        Task<T> GetEntityWithSpec(ISpecification<T> spec);
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);
        Task<int> CountAsync(ISpecification<T> spec);
    }
}
