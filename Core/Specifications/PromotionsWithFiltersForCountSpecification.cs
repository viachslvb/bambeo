using Core.Entities;

namespace Core.Specifications
{
    public class PromotionsWithFiltersForCountSpecification : BaseSpecification<Promotion>
    {
        public PromotionsWithFiltersForCountSpecification(PromotionSpecParams promotionParams) 
            : base(x =>
                (string.IsNullOrEmpty(promotionParams.Search) || x.Product.Name.ToLower().Contains(promotionParams.Search)) &&
                (!promotionParams.CategoryIds.Any() || promotionParams.CategoryIds.Contains(x.Product.ProductCategoryId)) &&
                (!promotionParams.StoreIds.Any() || promotionParams.StoreIds.Contains(x.Product.StoreId)) &&
                ((!promotionParams.IncludeUpcomingPromotions && DateTime.Now >= x.StartDate && DateTime.Now <= x.EndDate) ||
                (promotionParams.IncludeUpcomingPromotions && DateTime.Now <= x.EndDate))
            )
        {

        }
    }
}
