using System.ComponentModel.DataAnnotations;

namespace backend.Models.Blockchain
{
    public class BlockchainReceipt
    {
        [Key]
        public int Id { get; set; }

        public string Network { get; set; } = string.Empty;

        public string ContractAddress { get; set; } = string.Empty;

        public string TransactionHash { get; set; } = string.Empty;

        public long BlockNumber { get; set; }

        public DateTime ConfirmedAt { get; set; }
    }
}
