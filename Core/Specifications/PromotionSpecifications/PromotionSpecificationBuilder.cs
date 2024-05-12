using Core.Entities;
using LinqKit;
using System.Linq.Expressions;

namespace Core.Specifications
{
    public class PromotionSpecificationBuilder
    {
        public static Expression<Func<Promotion, bool>> BuildCriteria(PromotionSpecParams promotionParams)
        {
            var criteria = PredicateBuilder.New<Promotion>();

            // Filter by search term
            if (!string.IsNullOrEmpty(promotionParams.Search))
            {
                criteria = criteria.And(x => x.Product.Name.ToLower().Contains(promotionParams.Search));
            }

            // Filter by date
            var now = DateTime.Now;
            criteria = criteria.And(x =>
                (!promotionParams.IncludeUpcomingPromotions && now >= x.StartDate && now <= x.EndDate) ||
                (promotionParams.IncludeUpcomingPromotions && now <= x.EndDate)
            );

            // Filter by category and store
            if (promotionParams.CategoryIds.Any())
            {
                criteria = criteria.And(x => promotionParams.CategoryIds.Contains(x.Product.ProductCategoryId));
            }

            if (promotionParams.StoreIds.Any())
            {
                criteria = criteria.And(x => promotionParams.StoreIds.Contains(x.Product.StoreId));
            }

            return criteria;
        }
    }
}
