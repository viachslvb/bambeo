using Core.Entities;

namespace Core.Specifications
{
    public class PromotionsWithFiltersSpecification : BaseSpecification<Promotion>
    {
        public PromotionsWithFiltersSpecification(PromotionSpecParams promotionParams)
            : base(PromotionSpecificationBuilder.BuildCriteria(promotionParams))
        {
            AddInclude(x => x.Product);
            AddInclude(x => x.Product.ProductCategory);
            AddInclude(x => x.Product.Store);
            ApplyPaging(promotionParams.PageSize * (promotionParams.PageIndex - 1),
                promotionParams.PageSize);

            if (!string.IsNullOrEmpty(promotionParams.SortType))
            {
                switch (promotionParams.SortType)
                {
                    case "ByDateDesc":
                        AddOrderByDescending(p => p.StartDate);
                        break;
                    case "ByNameAsc":
                        AddOrderBy(p => p.Product.Name);
                        break;
                    case "ByPriceAsc":
                        AddOrderBy(p => p.Price);
                        break;
                    case "ByPriceDesc":
                        AddOrderByDescending(p => p.Price);
                        break;
                    default:
                        AddOrderBy(p => p.StartDate);
                        break;
                }
            }
            else
            {
                AddOrderByDescending(x => x.StartDate);
            }
        }

        public PromotionsWithFiltersSpecification(int id) : base(x => x.Id == id)
        {
            AddInclude(x => x.Product);
            AddInclude(x => x.Product.ProductCategory);
            AddInclude(x => x.Product.Store);
        }
    }
}
