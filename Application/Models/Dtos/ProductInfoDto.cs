namespace Application.Models.Dtos
{
    public class ProductInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public bool HasPromotion { get; set; }
        public ProductPromotionDto Promotion { get; set; }
        public ProductCategoryDto Category { get; set; }
        public StoreDto Store { get; set; }
        public List<ProductPromotionDto> Promotions { get; set; }
    }
}