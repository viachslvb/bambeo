using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class PromotionConfiguration : IEntityTypeConfiguration<Promotion>
    {
        public void Configure(EntityTypeBuilder<Promotion> builder)
        {
            // Property configurations
            builder.Property(p => p.Id).IsRequired();
            builder.Property(p => p.Price).HasColumnType("decimal(18,2)");
            builder.Property(p => p.PreviousPrice).HasColumnType("decimal(18,2)");

            // Index configurations
            builder.HasIndex(p => p.StartDate).HasDatabaseName("IDX_Promotion_StartDate");
            builder.HasIndex(p => p.EndDate).HasDatabaseName("IDX_Promotion_EndDate");
            builder.HasIndex(p => new { p.StartDate, p.EndDate }).HasDatabaseName("IDX_Promotion_StartEndDate");
        }
    }
}
