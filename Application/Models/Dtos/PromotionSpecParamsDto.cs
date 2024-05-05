namespace Application.Models.Dtos
{
    public class PromotionSpecParamsDto
    {
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string Search { get; set; }
        public IEnumerable<int> CategoryIds { get; set; } = new List<int>();
        public IEnumerable<int> StoreIds { get; set; } = new List<int>();
        public string SortType { get; set; }
        public bool IncludeUpcomingPromotions { get; set; }
    }
}
