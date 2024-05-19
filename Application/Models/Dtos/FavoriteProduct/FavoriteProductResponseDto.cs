namespace Application.Models.Dtos.FavoriteProduct
{
    public class FavoriteProductResponseDto
    {
        public IReadOnlyList<FavoriteProductDto> Products { get; set; }
        public int PromotionCount { get; set; }
    }
}