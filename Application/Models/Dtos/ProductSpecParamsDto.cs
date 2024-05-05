namespace Application.Models.Dtos
{
    public class ProductSpecParamsDto
    {
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string Search { get; set; }
        public int? CategoryId { get; set; }
        public int? StoreId { get; set; }
        public string SortType { get; set; }
    }
}
