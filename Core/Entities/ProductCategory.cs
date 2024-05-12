namespace Core.Entities
{
    public class ProductCategory : BaseEntity
    {
        public string Name { get; set; }
        public int? ParentCategoryId { get; set; }
        public virtual ProductCategory ParentCategory { get; set; }
        public virtual ICollection<ProductCategory> SubCategories { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}