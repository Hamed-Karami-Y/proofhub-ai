using backend.Data;
using backend.DTOs;
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

        public async Task<AuditResponseDto> CreateAuditAsync(
            string walletAddress,
            string prompt)
        {
            // 1. دریافت پاسخ از AI
            AIResponse aiResponse = await _aiProvider.GenerateAsync(prompt);

            // 2. ایجاد رکورد اثبات
            var auditRecord = _proofEngineService.CreateAuditRecord(
                walletAddress,
                aiResponse.Model,
                aiResponse.ModelVersion,
                prompt,
                aiResponse.Output);

            // 3. ذخیره در دیتابیس (بدون TransactionHash و ContractAddress)
            _dbContext.AuditRecords.Add(auditRecord);
            await _dbContext.SaveChangesAsync();

            // 4. بازگرداندن اطلاعات به فرانت‌اند
            return new AuditResponseDto
            {
                RecordId = auditRecord.AuditRecordId,
                ProofHash = auditRecord.ProofHash,
                Output = aiResponse.Output,
                Model = aiResponse.Model,
                CreatedAt = auditRecord.CreatedAt,
                Status = auditRecord.Status
            };
        }

        // متد جدید برای ثبت TransactionHash بعد از امضای کاربر
        public async Task<bool> ConfirmBlockchainRegistrationAsync(
            Guid recordId,
            string transactionHash,
            string contractAddress)
        {
            var record = await _dbContext.AuditRecords.FindAsync(recordId);
            if (record == null)
                return false;

            record.TransactionHash = transactionHash;
            record.ContractAddress = contractAddress;
            record.BlockchainVerified = true;
            record.Status = AuditStatus.Verified;

            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}