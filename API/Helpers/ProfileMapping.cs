using API.Models.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class ProfileMapping : Profile
    {
        public ProfileMapping()
        {
            CreateMap<Product, ProductDto>()
                //.ForMember(d => d.ProductCategory, o => o.MapFrom(s => s.ProductCategory.Name))
                //.ForMember(d => d.Store, o => o.MapFrom(s => s.Store.Name))
                .ForMember(d => d.ImageUrl, o => o.MapFrom<ProductUrlResolver>());

            CreateMap<Promotion, PromotionDto>()
                .ForMember(d => d.Product, o => o.MapFrom(s => s.Product));
        }
    }
}