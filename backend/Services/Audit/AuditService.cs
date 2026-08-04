using backend.Interfaces.Services;
using backend.Models.AI;
using backend.Models.Audit;

namespace backend.Services.Audit
{
    public class AuditService : IAuditService
    {
        private readonly IAIProvider _aiProvider;
        private readonly IProofEngineService _proofEngineService;

        public AuditService(
            IAIProvider aiProvider,
            IProofEngineService proofEngineService)
        {
            _aiProvider = aiProvider;
            _proofEngineService = proofEngineService;
        }

        public async Task<AuditRecord> CreateAuditAsync(
            string walletAddress,
            string prompt)
        {
            AIResponse aiResponse = await _aiProvider.GenerateAsync(prompt);

            var auditRecord = _proofEngineService.CreateAuditRecord(
                walletAddress,
                aiResponse.Model,
                aiResponse.ModelVersion,
                prompt,
                aiResponse.Output);

            return auditRecord;
        }
    }
}
