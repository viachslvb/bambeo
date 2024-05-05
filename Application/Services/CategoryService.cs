using Application.Helpers;
using Application.Interfaces;
using Application.Models.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces.Repositories;

namespace Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IGenericRepository<ProductCategory> _categoriesRepository;
        private readonly IMapper _mapper;

        public CategoryService(IGenericRepository<ProductCategory> categoriesRepository, IMapper mapper)
        {
            _categoriesRepository = categoriesRepository;
            _mapper = mapper;
        }

        public async Task<ServiceResult<List<ProductCategoryDto>>> GetCategories()
        {
            var categories = await _categoriesRepository.ListAllAsync();

            var categoriesList = new List<ProductCategoryDto>();
            foreach (var category in categories)
            {
                var categoryDto = _mapper.Map<ProductCategoryDto>(category);
                if (categoryDto.Categories != null && categoryDto.Categories.Any())
                {
                    categoriesList.Add(categoryDto);
                }
            }

            return ServiceResult<List<ProductCategoryDto>>.SuccessResult(categoriesList);
        }
    }
}
