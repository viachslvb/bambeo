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

            CreateMap<Promotion, PromotionDto>()
                .ForMember(d => d.Product, o => o.MapFrom(s => s.Product));

            CreateMap<UserSettings, UserSettingsToReturnDto>()
                .ForMember(dest => dest.EmailSettings, opt => opt.MapFrom(src => new EmailSettingsDto
                {
                    GeneralPromotionalEmails = src.GeneralPromotionalEmails,
                    NotificationsForFollowedProducts = src.NotificationsForFollowedProducts
                }));

            CreateMap<ProductCategory, ProductCategoryDto>();

            CreateMap<Store, StoreDto>();

            CreateMap<ProductSpecParamsDto, ProductSpecParams>();

            CreateMap<PromotionSpecParamsDto, PromotionSpecParams>();

        }
    }
}