using Application.Models.Dtos;
using Application.Models.Dtos.FavoriteProduct;
using Application.Models.Dtos.Product;
using Application.Models.Dtos.Promotion;
using Application.Models.Dtos.User;
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

            CreateMap<Product, PromotionProductDto>()
                .ForMember(d => d.ImageUrl, o => o.MapFrom<ProductUrlResolver>());

            CreateMap<Product, ProductInfoDto>()
                .ForMember(d => d.ImageUrl, o => o.MapFrom<ProductUrlResolver>())
                .ForMember(d => d.Category, o => o.MapFrom(s => s.ProductCategory));

            CreateMap<Promotion, PromotionDto>()
                .ForMember(d => d.Product, o => o.MapFrom(s => s.Product));

            CreateMap<Promotion, ProductPromotionDto>();

            CreateMap<Promotion, FavoriteProductPromotionDto>();

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

            CreateMap<FavoriteProduct, FavoriteProductDto>()
                .ForMember(
                    dest => dest.Name, 
                    opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(
                    dest => dest.ImageUrl,
                    opt => opt.MapFrom<FavoriteProductUrlResolver>())
                .ForMember(
                    dest => dest.Store,
                    opt => opt.MapFrom(src => src.Product.Store.Name))
                .ForMember(
                    dest => dest.HasPromotion, 
                    opt => opt.MapFrom(src => 
                        src.Product.Promotions
                            .Any(p => p.StartDate <= DateTime.Now && p.EndDate >= DateTime.Now)))
                .ForMember(
                    dest => dest.Promotion,
                    opt => opt.MapFrom(src => 
                        src.Product.Promotions
                            .FirstOrDefault(p => p.StartDate <= DateTime.Now && p.EndDate >= DateTime.Now)));
        }
    }
}