namespace backend.Models.Audit
{
    public class VerificationResult
    {
        public Guid AuditId { get; set; }

        public VerificationStatus Status { get; set; }

        public bool IsValid { get; set; }

        public bool BlockchainVerified { get; set; }

        public string Message { get; set; } = string.Empty;

        public DateTime VerifiedAt { get; set; }
    }
}
