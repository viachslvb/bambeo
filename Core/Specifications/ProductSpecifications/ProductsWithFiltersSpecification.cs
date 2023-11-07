using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithFiltersSpecification : BaseSpecification<Product>
    {
        public ProductsWithFiltersSpecification(ProductSpecParams productParams) : base(x =>
        (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains(productParams.Search)) &&
        (!productParams.CategoryId.HasValue || x.ProductCategoryId == productParams.CategoryId) &&
        (!productParams.StoreId.HasValue || x.StoreId == productParams.StoreId)
        )
        {
            AddInclude(x => x.ProductCategory);
            AddInclude(x => x.Store);
            AddOrderBy(x => x.Name);
            ApplyPaging(productParams.PageSize * (productParams.PageIndex - 1),
                productParams.PageSize);

            if (!string.IsNullOrEmpty(productParams.SortType))
            {
                switch (productParams.SortType)
                {
                    case "ByDateAsc":
                        AddOrderBy(p => p.CreatedAt);
                        break;
                    case "ByNameAsc":
                        AddOrderBy(p => p.Name);
                        break;
                    default:
                        AddOrderBy(p => p.Name);
                        break;
                }
            }
        }

        public ProductsWithFiltersSpecification(int id) : base(x => x.Id == id)
        {
            AddInclude(x => x.ProductCategory);
            AddInclude(x => x.Store);
        }
    }
}
