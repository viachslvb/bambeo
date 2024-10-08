﻿namespace Application.Models.Dtos.FavoriteProduct
{
    public class FavoriteProductPromotionDto
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        public decimal PreviousPrice { get; set; }
        public int DiscountPercentage { get; set; }
        public string DiscountCondition { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
