using Core.Entities;
using System.Linq;

namespace Core.Specifications
{
    public class PromotionsWithFiltersSpecification : BaseSpecification<Promotion>
    {
        public PromotionsWithFiltersSpecification(PromotionSpecParams promotionParams)
            : base(x =>
                (string.IsNullOrEmpty(promotionParams.Search) || x.Product.Name.ToLower().Contains(promotionParams.Search)) &&
                (!promotionParams.CategoryIds.Any() || promotionParams.CategoryIds.Contains(x.Product.ProductCategoryId)) &&
                (!promotionParams.StoreIds.Any() || promotionParams.StoreIds.Contains(x.Product.StoreId)) &&
                ((!promotionParams.IncludeUpcomingPromotions && DateTime.Now >= x.StartDate && DateTime.Now <= x.EndDate) ||
                (promotionParams.IncludeUpcomingPromotions && DateTime.Now <= x.EndDate))
            )
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
