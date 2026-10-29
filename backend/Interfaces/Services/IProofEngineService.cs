using backend.Models.Audit;

namespace backend.Interfaces.Services
{
    public interface IProofEngineService
    {
        string GeneratePromptHash(string prompt);

        string GenerateOutputHash(string output);

        string GenerateProofHash(
            string promptHash,
            string outputHash,
            string model,
            string modelVersion,
            DateTime createdAt,
            string walletAddress);

        AuditRecord CreateAuditRecord(
            string walletAddress,
            string model,
            string modelVersion,
            string prompt,
            string output);
    }
}
