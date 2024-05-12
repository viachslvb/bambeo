#nullable enable
namespace Application.Models.Dtos
{
    public class PromotionSpecParamsDto
    {
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 12;
        public string? Search { get; set; }
        public string? CategoryIds { get; set; }
        public string? StoreIds { get; set; }
        public string? SortType { get; set; }
        public bool? IncludeUpcomingPromotions { get; set; }
    }
}