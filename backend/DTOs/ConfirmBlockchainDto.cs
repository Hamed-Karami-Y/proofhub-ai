// DTOs/ConfirmBlockchainDto.cs
namespace backend.DTOs
{
    public class ConfirmBlockchainDto
    {
        public string RecordId { get; set; } = string.Empty;
        public string TransactionHash { get; set; } = string.Empty;
        public string ContractAddress { get; set; } = string.Empty;
    }
}