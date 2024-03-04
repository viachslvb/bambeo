using API.Models.ApiResponses;
using API.Models.Dtos;
using API.Models.Enums;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductCategory> _categoriesRepo;
        private readonly IMapper _mapper;

        public ProductsController(IGenericRepository<Product> productsRepo,
            IGenericRepository<ProductCategory> categoriesRepo, IMapper mapper)
        {
            _productsRepo = productsRepo;
            _categoriesRepo = categoriesRepo;
            _mapper = mapper;
        }

        // GET api/products
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<Product>>> GetProducts([FromQuery] ProductSpecParams productSpecParams)
        {
            var spec = new ProductsWithFiltersSpecification(productSpecParams);
            var countSpec = new ProductsWithFiltersForCountSpecification(productSpecParams);

            var totalItems = await _productsRepo.CountAsync(countSpec);
            var products = await _productsRepo.ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<ProductDto>>(products);

            return Ok(new ApiResponse<PaginationResponse<ProductDto>>
            (
                new PaginationResponse<ProductDto>(
                    productSpecParams.PageIndex, 
                    productSpecParams.PageSize, 
                    totalItems,
                    data)
            ));
        }

        // GET api/products/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var spec = new ProductsWithFiltersSpecification(id);
            var product = await _productsRepo.GetEntityWithSpec(spec);

            if (product == null) return NotFound(new ApiErrorResponse(ApiErrorCode.NotFound));

            // 
            return Ok(new ApiResponse<ProductDto>(
                _mapper.Map<Product, ProductDto>(product)
            ));
        }

        // GET api/products/categories
        [HttpGet("categories")]
        public async Task<ActionResult<List<ProductCategory>>> GetProductCategories()
        {
            var categories = await _categoriesRepo.ListAllAsync();

            // fix this
            var list = new List<ProductCategory>();
            foreach (var category in categories)
            {
                if (category.Categories != null && category.Categories.Any())
                {
                    list.Add(category);
                }
            }

            return Ok(new ApiResponse<List<ProductCategory>>(list));
        }
    }
}
