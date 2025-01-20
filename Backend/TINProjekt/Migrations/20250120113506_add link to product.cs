using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TINProjekt.Migrations
{
    /// <inheritdoc />
    public partial class addlinktoproduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PictLink",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PictLink",
                table: "Products");
        }
    }
}
