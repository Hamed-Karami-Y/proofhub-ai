using backend.Models.Blockchain;

namespace backend.Models.Audit
{
    public class AuditRecord
    {
        public Guid AuditRecordId { get; set; } = Guid.NewGuid();

        public string WalletAddress { get; set; } = string.Empty;

        public string Model { get; set; } = string.Empty;

        public string ModelVersion { get; set; } = string.Empty;

        public string PromptHash { get; set; } = string.Empty;

        public string OutputHash { get; set; } = string.Empty;

        public string ProofHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public AuditStatus Status { get; set; }

        public BlockchainReceipt? Blockchain { get; set; }
    }
}
