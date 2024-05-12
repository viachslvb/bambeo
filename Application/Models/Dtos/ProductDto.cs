using Core.Entities;

namespace Application.Models.Dtos
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public ProductCategoryDto ProductCategory { get; set; }
        public StoreDto Store { get; set; }
    }
}