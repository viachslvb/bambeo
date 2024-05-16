using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace Application.Helpers
{
    public class ProductUrlResolver : IValueResolver<Product, object, string>
    {
        private readonly IConfiguration _config;

        public ProductUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(Product source, object destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.ImageUrl))
            {
                return _config["ApiUrl"] + source.ImageUrl;
            }

            return null;
        }
    }
}