using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace Application.Helpers
{
    public class FavoriteProductUrlResolver : IValueResolver<FavoriteProduct, object, string>
    {
        private readonly IConfiguration _config;

        public FavoriteProductUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(FavoriteProduct source, object destination, string destMember, ResolutionContext context)
        {
            var product = source.Product;

            if (product != null && !string.IsNullOrEmpty(product.ImageUrl))
            {
                return _config["ApiUrl"] + product.ImageUrl;
            }

            return null;
        }
    }
}