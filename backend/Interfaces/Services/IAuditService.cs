using backend.DTOs;

namespace backend.Interfaces.Services
{
    public interface IAuditService
    {
        Task<AuditResponseDto> CreateAuditAsync(
            string walletAddress,
            string prompt);

        Task<bool> ConfirmBlockchainRegistrationAsync(
            Guid recordId,
            string transactionHash,
            string contractAddress);
    }
}