using backend.Data;
using backend.Interfaces.Services;
using backend.Models.AI;
using backend.Models.Audit;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Audit
{
    public class AuditService : IAuditService
    {
        private readonly IAIProvider _aiProvider;
        private readonly IProofEngineService _proofEngineService;
        private readonly ApplicationDbContext _dbContext;

        public AuditService(
            IAIProvider aiProvider,
            IProofEngineService proofEngineService,
            ApplicationDbContext dbContext)
        {
            _aiProvider = aiProvider;
            _proofEngineService = proofEngineService;
            _dbContext = dbContext;
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

            _dbContext.AuditRecords.Add(auditRecord);

            await _dbContext.SaveChangesAsync();

            return auditRecord;
        }
    }
}
