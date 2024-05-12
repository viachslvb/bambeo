using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeModelRelationshipsAndAddIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "IX_Products_StoreId",
                table: "Products",
                newName: "IDX_Product_StoreId");

            migrationBuilder.RenameIndex(
                name: "IX_Products_ProductCategoryId",
                table: "Products",
                newName: "IDX_Product_CategoryId");

            migrationBuilder.CreateIndex(
                name: "IDX_Promotion_EndDate",
                table: "Promotions",
                column: "EndDate");

            migrationBuilder.CreateIndex(
                name: "IDX_Promotion_StartDate",
                table: "Promotions",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IDX_Promotion_StartEndDate",
                table: "Promotions",
                columns: new[] { "StartDate", "EndDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IDX_Promotion_EndDate",
                table: "Promotions");

            migrationBuilder.DropIndex(
                name: "IDX_Promotion_StartDate",
                table: "Promotions");

            migrationBuilder.DropIndex(
                name: "IDX_Promotion_StartEndDate",
                table: "Promotions");

            migrationBuilder.RenameIndex(
                name: "IDX_Product_StoreId",
                table: "Products",
                newName: "IX_Products_StoreId");

            migrationBuilder.RenameIndex(
                name: "IDX_Product_CategoryId",
                table: "Products",
                newName: "IX_Products_ProductCategoryId");
        }
    }
}
