namespace Core.Entities
{
    public class Promotion : BaseEntity
    {
        public Product Product { get; set; }
        public int ProductId { get; set; }
        public decimal Price { get; set; }
        public decimal PreviousPrice { get; set; }
        public int DiscountPercentage { get; set; }
        public string DiscountCondition { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}