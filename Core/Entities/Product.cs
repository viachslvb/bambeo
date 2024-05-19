namespace Core.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }

        public int ProductCategoryId { get; set; }
        public int StoreId { get; set; }

        public ProductCategory ProductCategory { get; set; }
        public Store Store { get; set; }
        public virtual ICollection<Promotion> Promotions { get; set; }
        public virtual ICollection<FavoriteProduct> Favorites { get; set; }
    }
}