using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class CancelChangedCategoryModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductCategories_ProductCategories_ParentCategoryId",
                table: "ProductCategories");

            migrationBuilder.RenameColumn(
                name: "ParentCategoryId",
                table: "ProductCategories",
                newName: "ProductCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_ProductCategories_ParentCategoryId",
                table: "ProductCategories",
                newName: "IX_ProductCategories_ProductCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductCategories_ProductCategories_ProductCategoryId",
                table: "ProductCategories",
                column: "ProductCategoryId",
                principalTable: "ProductCategories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductCategories_ProductCategories_ProductCategoryId",
                table: "ProductCategories");

            migrationBuilder.RenameColumn(
                name: "ProductCategoryId",
                table: "ProductCategories",
                newName: "ParentCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_ProductCategories_ProductCategoryId",
                table: "ProductCategories",
                newName: "IX_ProductCategories_ParentCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductCategories_ProductCategories_ParentCategoryId",
                table: "ProductCategories",
                column: "ParentCategoryId",
                principalTable: "ProductCategories",
                principalColumn: "Id");
        }
    }
}
