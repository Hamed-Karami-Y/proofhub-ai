using backend.Models.Audit;

namespace backend.Interfaces.Services
{
    public interface IAuditService
    {
        Task<AuditRecord> CreateAuditAsync(
            string walletAddress,
            string prompt);
    }
}
