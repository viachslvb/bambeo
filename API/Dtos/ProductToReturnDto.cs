using Core.Entities;

namespace API.Dtos
{
    public class ProductToReturnDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public ProductCategory ProductCategory { get; set; }
        public Store Store { get; set; }
    }
}