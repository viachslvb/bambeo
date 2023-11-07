using System.Text.Json;
using Core.Entities;

namespace Infrastructure.Data
{
    public class PromotionContextSeed
    {
        public static async Task SeedAsync(PromotionContext context)
        {
            //if (!context.ProductCategories.Any())
            //{
            //    var categoriesData = File.ReadAllText("../Infrastructure/Data/SeedData/categories.json");
            //    var categories = JsonSerializer.Deserialize<List<ProductCategory>>(categoriesData);
            //    context.ProductCategories.AddRange(categories);
            //}

            //if (!context.Stores.Any())
            //{
            //    var storesData = File.ReadAllText("../Infrastructure/Data/SeedData/stores.json");
            //    var stores = JsonSerializer.Deserialize<List<Store>>(storesData);
            //    context.Stores.AddRange(stores);
            //}

            //if (!context.Products.Any())
            //{
            //    var productsData = File.ReadAllText("../Infrastructure/Data/SeedData/products.json");
            //    var products = JsonSerializer.Deserialize<List<Product>>(productsData);
            //    context.Products.AddRange(products);
            //}

            //if (!context.Promotions.Any())
            //{
            //    var promotionsData = File.ReadAllText("../Infrastructure/Data/SeedData/promotions.json");
            //    var promotions = JsonSerializer.Deserialize<List<Promotion>>(promotionsData);
            //    context.Promotions.AddRange(promotions);
            //}


            if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
        }
    }
}