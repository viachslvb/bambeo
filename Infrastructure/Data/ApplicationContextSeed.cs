using Core.Entities;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;

namespace Infrastructure.Data
{
    public class ApplicationContextSeed
    {
        public static async Task SeedAsync(ApplicationDbContext context, UserManager<AppUser> userManager)
        {
            //if (!context.ProductCategories.Any())
            //{
            //    var categoriesData = File.ReadAllText("../Infrastructure/Data/SeedData/categories.json");
            //    var categories = JsonSerializer.Deserialize<List<ProductCategory>>(categoriesData);

            //    foreach (var parentCategory in categories)
            //    {
            //        await AddCategoryRecursiveAsync(context, parentCategory, null);
            //    }
            //}

            //if (!context.Stores.Any())
            //{
            //    var storesData = File.ReadAllText("../Infrastructure/Data/SeedData/stores.json");
            //    var stores = JsonSerializer.Deserialize<List<Store>>(storesData);
            //    context.Stores.AddRange(stores);
            //}

            //if (!context.Products.Any())
            //{
            //var productsData = File.ReadAllText("../Infrastructure/Data/SeedData/products.json");
            //var products = JsonSerializer.Deserialize<List<Product>>(productsData);
            //context.Products.AddRange(products);
            //}

            //if (!context.Promotions.Any())
            //{
            //var promotionsData = File.ReadAllText("../Infrastructure/Data/SeedData/promotions.json");
            //var promotions = JsonSerializer.Deserialize<List<Promotion>>(promotionsData);
            //context.Promotions.AddRange(promotions);
            //}

            //if (!userManager.Users.Any())
            //{
            //    var user = new AppUser
            //    {
            //        DisplayName = "Viacheslav",
            //        Email = "viacheslav.borys@gmail.com",
            //        UserName = "viachslvb",
            //    };

            //    await userManager.CreateAsync(user, "uUA1Q1(4$@Zc");
            //}


            if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
        }

        private static async Task AddCategoryRecursiveAsync(ApplicationDbContext context, ProductCategory categoryDto, int? parentId)
        {
            var category = new ProductCategory
            {
                Name = categoryDto.Name,
                ParentCategoryId = parentId
            };

            context.ProductCategories.Add(category);
            await context.SaveChangesAsync();

            if (categoryDto.SubCategories != null && categoryDto.SubCategories.Any())
            {
                foreach (var subCategory in categoryDto.SubCategories)
                {
                    await AddCategoryRecursiveAsync(context, subCategory, category.Id);
                }
            }
        }
    }
}