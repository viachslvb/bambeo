namespace Core.Specifications
{
    public class PromotionSpecParams
    {
        private const int MaxPageSize = 50;

        private int _pageIndex;
        public int PageIndex
        {
            get => _pageIndex;
            set => _pageIndex = (value < 1) ? 1 : value;
        }

        private int _pageSize;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize)
                ? MaxPageSize
                : (value < 1) ? 1 : value;
        }

        private string _search;
        public string Search
        {
            get => _search;
            set => _search = value?.ToLower();
        }

        public IEnumerable<int> CategoryIds { get; set; } = new List<int>();
        public IEnumerable<int> StoreIds { get; set; } = new List<int>();
        public string SortType { get; set; }
        private bool _includeUpcomingPromotions;
        public bool IncludeUpcomingPromotions
        {
            get => _includeUpcomingPromotions;
            set => _includeUpcomingPromotions = value;
        }
    }
}