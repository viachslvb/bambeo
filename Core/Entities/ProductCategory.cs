namespace Core.Entities
{
    public class ProductCategory : BaseEntity
    {
        public string Name { get; set; }
        public List<ProductCategory> Categories { get; set; }
    }
}
