namespace Application.Models.Dtos
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<CategoryDto> SubCategories { get; set; } = new List<CategoryDto>();
    }
}