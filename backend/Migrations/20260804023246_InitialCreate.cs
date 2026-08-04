using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BlockchainReceipt",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Network = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContractAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TransactionHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BlockNumber = table.Column<long>(type: "bigint", nullable: false),
                    ConfirmedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlockchainReceipt", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuditRecords",
                columns: table => new
                {
                    AuditRecordId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WalletAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Model = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ModelVersion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PromptHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OutputHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProofHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    BlockchainId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditRecords", x => x.AuditRecordId);
                    table.ForeignKey(
                        name: "FK_AuditRecords_BlockchainReceipt_BlockchainId",
                        column: x => x.BlockchainId,
                        principalTable: "BlockchainReceipt",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditRecords_BlockchainId",
                table: "AuditRecords",
                column: "BlockchainId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditRecords");

            migrationBuilder.DropTable(
                name: "BlockchainReceipt");
        }
    }
}
