using Application.Enums;
using Application.Helpers;
using Application.Interfaces;
using Application.Models.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces.Repositories;

namespace Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IGenericRepository<Product> _productsRepo;
        
        private readonly IMapper _mapper;
        
        public ProductService(IGenericRepository<Product> productsRepo, IMapper mapper)
        {
            _productsRepo = productsRepo;
            _mapper = mapper;
        }

        public async Task<ServiceResult<ProductDto>> GetProductById(int id)
        {
            var product = await _productsRepo.GetByIdAsync(id);

            if (product == null)
            {
                return ServiceResult<ProductDto>.FailureResult(ErrorCode.NotFound);
            }

            ProductDto productDto = _mapper.Map<Product, ProductDto>(product);
            return ServiceResult<ProductDto>.SuccessResult(productDto);
        }
    }
}
