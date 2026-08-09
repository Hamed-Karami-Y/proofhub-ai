// DTOs/AuditResponseDto.cs
using backend.Models.Audit;

namespace backend.DTOs
{
    public class AuditResponseDto
    {
        public Guid RecordId { get; set; }
        public string ProofHash { get; set; } = string.Empty;
        public string Output { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public AuditStatus Status { get; set; }
    }
}