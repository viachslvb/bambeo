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
        private readonly ICategoryRepository _categoriesRepository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoriesRepository, IMapper mapper)
        {
            _categoriesRepository = categoriesRepository;
            _mapper = mapper;
        }

        public async Task<ServiceResult<List<CategoryDto>>> GetCategories()
        {
            var categories = await _categoriesRepository.GetCategoriesWithSubCategoriesAsync();
            List<CategoryDto> categoriesDto = _mapper.Map<List<CategoryDto>>(categories);

            return ServiceResult<List<CategoryDto>>.SuccessResult(categoriesDto);
        }

        public List<int> GetAllCategoryIdsIncludingSubCategories(List<int> categoryIds, List<CategoryDto> allCategories)
        {
            var allIds = new List<int>(categoryIds);

            foreach (var categoryId in categoryIds)
            {
                allIds.AddRange(GetSubCategoryIds(allCategories, categoryId));
            }

            return allIds.Distinct().ToList();
        }

        private List<int> GetSubCategoryIds(List<CategoryDto> categories, int parentId)
        {
            var subCategoryIds = new List<int>();

            var parentCategory = categories.FirstOrDefault(c => c.Id == parentId);
            if (parentCategory != null && parentCategory.SubCategories != null)
            {
                foreach (var subCategory in parentCategory.SubCategories)
                {
                    subCategoryIds.Add(subCategory.Id);
                    subCategoryIds.AddRange(GetSubCategoryIds(categories, subCategory.Id));
                }
            }

            return subCategoryIds;
        }
    }
}
