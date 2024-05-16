using Application.Models.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Specifications;

namespace Application.Helpers
{
    public class ProfileMapping : Profile
    {
        public ProfileMapping()
        {
            CreateMap<AppUser, UserDto>();

            CreateMap<Product, ProductDto>()
                .ForMember(d => d.ImageUrl, o => o.MapFrom<ProductUrlResolver>());

            CreateMap<Product, ProductInfoDto>()
                .ForMember(d => d.ImageUrl, o => o.MapFrom<ProductUrlResolver>())
                .ForMember(d => d.Category, o => o.MapFrom(s => s.ProductCategory));

            CreateMap<Promotion, PromotionDto>()
                .ForMember(d => d.Product, o => o.MapFrom(s => s.Product));

            CreateMap<Promotion, ProductPromotionDto>();

            CreateMap<UserSettings, UserSettingsToReturnDto>()
                .ForMember(dest => dest.EmailSettings, opt => opt.MapFrom(src => new EmailSettingsDto
                {
                    GeneralPromotionalEmails = src.GeneralPromotionalEmails,
                    NotificationsForFollowedProducts = src.NotificationsForFollowedProducts
                }));

            CreateMap<ProductCategory, CategoryDto>();

            CreateMap<ProductCategory, ProductCategoryDto>();
                

            CreateMap<Store, StoreDto>();

            CreateMap<PromotionSpecParamsDto, PromotionSpecParams>()
                .ForMember(dest => dest.CategoryIds, opt => opt.MapFrom(
                    src => new StringToIntEnumerableResolver()
                    .Resolve(src.CategoryIds, null, null, null)))
                .ForMember(dest => dest.StoreIds, opt => opt.MapFrom(
                    src => new StringToIntEnumerableResolver()
                    .Resolve(src.StoreIds, null, null, null)));
        }
    }
}