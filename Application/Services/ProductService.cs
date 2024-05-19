using Application.Enums;
using Application.Helpers;
using Application.Interfaces;
using Application.Models.Dtos.Product;
using AutoMapper;
using Core.Entities;
using Core.Interfaces.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productsRepo;
        private readonly IMapper _mapper;
        private readonly ILogger<ProductService> _logger;
        
        public ProductService(IProductRepository productsRepo, IMapper mapper, ILogger<ProductService> logger)
        {
            _productsRepo = productsRepo;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<ServiceResult<ProductInfoDto>> GetProductById(int id)
        {
            var product = await _productsRepo.GetByIdAsync(id);

            if (product == null)
            {
                return ServiceResult<ProductInfoDto>.FailureResult(ErrorCode.NotFound);
            }

            ProductInfoDto productDto = _mapper.Map<Product, ProductInfoDto>(product);

            var currentDate = DateTime.UtcNow;

            // Find the current active promotion
            var activePromotion = productDto.Promotions
                .FirstOrDefault(promo => promo.StartDate <= currentDate && promo.EndDate >= currentDate);

            if (activePromotion != null)
            {
                productDto.HasPromotion = true;
                productDto.Promotion = activePromotion;
            }
            else
            {
                productDto.HasPromotion = false;
                productDto.Promotion = null;
            }

            return ServiceResult<ProductInfoDto>.SuccessResult(productDto);
        }
    }
}
