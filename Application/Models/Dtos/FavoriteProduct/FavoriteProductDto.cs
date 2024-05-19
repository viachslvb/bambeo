using Application.Models.Dtos.Promotion;

namespace Application.Models.Dtos.FavoriteProduct
{
    public class FavoriteProductDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Store { get; set; }
        public string ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool HasPromotion { get; set; }
        public FavoriteProductPromotionDto Promotion { get; set; }
    }
}
