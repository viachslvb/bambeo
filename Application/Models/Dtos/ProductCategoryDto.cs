namespace Application.Models.Dtos
{
    public class ProductCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<ProductCategoryDto> SubCategories { get; set; } = new List<ProductCategoryDto>();
    }
}