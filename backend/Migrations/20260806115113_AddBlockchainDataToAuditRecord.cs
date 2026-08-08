using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddBlockchainDataToAuditRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "BlockNumber",
                table: "AuditRecords",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "BlockchainVerified",
                table: "AuditRecords",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ContractAddress",
                table: "AuditRecords",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TransactionHash",
                table: "AuditRecords",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BlockNumber",
                table: "AuditRecords");

            migrationBuilder.DropColumn(
                name: "BlockchainVerified",
                table: "AuditRecords");

            migrationBuilder.DropColumn(
                name: "ContractAddress",
                table: "AuditRecords");

            migrationBuilder.DropColumn(
                name: "TransactionHash",
                table: "AuditRecords");
        }
    }
}
