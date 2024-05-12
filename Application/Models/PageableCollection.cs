namespace Application.Models
{
    public class PageableCollection<T> where T : class
    {
        public PageableCollection(int pageIndex, int pageSize, int count, IReadOnlyList<T> data, bool hasNextPage, bool hasPreviousPage)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            Count = count;
            Data = data;
            HasNextPage = hasNextPage;
            HasPreviousPage = hasPreviousPage;
        }

        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int Count { get; set; }
        public bool HasPreviousPage { get; set; }
        public bool HasNextPage { get; set; }
        public IReadOnlyList<T> Data { get; set; }
    }
}