using Application.Enums;
using Application.Helpers;
using Application.Interfaces;
using Application.Models;
using Application.Models.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces.Repositories;
using Core.Specifications;

namespace Application.Services
{
    public class ProductService : IProductService
    {
        private readonly ISpecificationRepository<Product> _productsRepo;
        
        private readonly IMapper _mapper;
        
        public ProductService(ISpecificationRepository<Product> productsRepo, IMapper mapper)
        {
            _productsRepo = productsRepo;
            _mapper = mapper;
        }

        public async Task<ServiceResult<PageableCollection<ProductDto>>> GetProductsWithSpec(ProductSpecParamsDto productSpecParamsDto)
        {
            var productSpecParams = _mapper.Map<ProductSpecParams>(productSpecParamsDto);

            var spec = new ProductsWithFiltersSpecification(productSpecParams);
            var countSpec = new ProductsWithFiltersForCountSpecification(productSpecParams);

            var totalItems = await _productsRepo.CountAsync(countSpec);
            var products = await _productsRepo.ListAsync(spec);

            var productsDto = _mapper.Map<IReadOnlyList<ProductDto>>(products);

            PageableCollection<ProductDto> productsPageableCollection = new (
                productSpecParams.PageIndex, 
                productSpecParams.PageSize,
                totalItems,
                productsDto
            );

            return ServiceResult<PageableCollection<ProductDto>>.SuccessResult(productsPageableCollection);
        }

        public async Task<ServiceResult<ProductDto>> GetProductById(int id)
        {
            var spec = new ProductsWithFiltersSpecification(id);
            var product = await _productsRepo.GetEntityWithSpec(spec);

            if (product == null)
            {
                return ServiceResult<ProductDto>.FailureResult(ErrorCode.NotFound);
            }

            ProductDto productDto = _mapper.Map<Product, ProductDto>(product);
            return ServiceResult<ProductDto>.SuccessResult(productDto);
        }
    }
}
