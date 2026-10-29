using backend.Interfaces.Services;
using backend.Models.Audit;

namespace backend.Services.Proof
{
    public class ProofEngineService : IProofEngineService
    {
        private readonly IHashService _hashService;

        public ProofEngineService(IHashService hashService)
        {
            _hashService = hashService;
        }

        public string GeneratePromptHash(string prompt)
        {
            return _hashService.ComputeSha256(prompt);
        }

        public string GenerateOutputHash(string output)
        {
            return _hashService.ComputeSha256(output);
        }

        public string GenerateProofHash(
            string promptHash,
            string outputHash,
            string model,
            string modelVersion,
            DateTime createdAt,
            string walletAddress)
        {
            var proof = string.Join('|',
                promptHash,
                outputHash,
                model,
                modelVersion,
                createdAt.ToUniversalTime().ToString("O"),
                walletAddress);

            return _hashService.ComputeSha256(proof);
        }

        public AuditRecord CreateAuditRecord(
            string walletAddress,
            string model,
            string modelVersion,
            string prompt,
            string output)
        {
            var createdAt = DateTime.UtcNow;

            var promptHash = GeneratePromptHash(prompt);
            var outputHash = GenerateOutputHash(output);

            var proofHash = GenerateProofHash(
                promptHash,
                outputHash,
                model,
                modelVersion,
                createdAt,
                walletAddress);

            return new AuditRecord
            {
                AuditRecordId = Guid.NewGuid(),
                WalletAddress = walletAddress,
                Model = model,
                ModelVersion = modelVersion,
                PromptHash = promptHash,
                OutputHash = outputHash,
                ProofHash = proofHash,
                CreatedAt = createdAt,
                Status = AuditStatus.Verified
            };
        }
    }
}
