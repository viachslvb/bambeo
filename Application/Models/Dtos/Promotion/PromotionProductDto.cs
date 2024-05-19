using Application.Models.Dtos.Product;

namespace Application.Models.Dtos.Promotion
{
    public class PromotionProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public ProductCategoryDto ProductCategory { get; set; }
        public StoreDto Store { get; set; }
    }
}