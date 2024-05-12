using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            // Index configurations
            builder.HasIndex(p => p.ProductCategoryId).HasDatabaseName("IDX_Product_CategoryId");
            builder.HasIndex(p => p.StoreId).HasDatabaseName("IDX_Product_StoreId");
        }
    }
}
