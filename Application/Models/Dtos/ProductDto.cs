namespace Application.Models.Dtos
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public CategoryDto ProductCategory { get; set; }
        public StoreDto Store { get; set; }
    }
}