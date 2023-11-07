using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithFiltersForCountSpecification : BaseSpecification<Product>
    {
        public ProductsWithFiltersForCountSpecification(ProductSpecParams productParams) : base(x =>
        (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains(productParams.Search)) &&
        (!productParams.CategoryId.HasValue || x.ProductCategoryId == productParams.CategoryId) &&
        (!productParams.StoreId.HasValue || x.StoreId == productParams.StoreId)
        )
        {

        }
    }
}
