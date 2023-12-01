using Core.Entities;

namespace Core.Specifications
{
    public class PromotionsWithFiltersForCountSpecification : BaseSpecification<Promotion>
    {
        public PromotionsWithFiltersForCountSpecification(PromotionSpecParams promotionParams) 
            : base(PromotionSpecificationBuilder.BuildCriteria(promotionParams))
        {
        }
    }
}
