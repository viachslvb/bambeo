using Core.Entities.Identity;

namespace Core.Entities
{
    public class FavoriteProduct : BaseEntity
    {
        public string UserId { get; set; }
        public int ProductId { get; set; }
        public DateTime CreatedAt { get; set; }
        public virtual AppUser User { get; set; }
        public virtual Product Product { get; set; }
    }
}
