using backend.Data;
using backend.Models.Audit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("audit")]
    public class AuditController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public AuditController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET /api/audit
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var audits = await _dbContext.AuditRecords
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new
                {
                    a.AuditRecordId,
                    a.WalletAddress,
                    a.Model,
                    a.ProofHash,
                    a.CreatedAt,
                    a.Status,
                    a.BlockchainVerified,
                    a.TransactionHash
                })
                .ToListAsync();

            return Ok(new { audits });
        }

        // GET /api/audit/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var audit = await _dbContext.AuditRecords
                .FirstOrDefaultAsync(a => a.AuditRecordId == id);

            if (audit == null)
                return NotFound();

            return Ok(audit);
        }

        // POST /api/audit/verify
        [HttpPost("verify")]
        public async Task<IActionResult> Verify([FromBody] VerifyDto request)
        {
            // پیاده‌سازی ساده: فقط چک کند که proofHash در دیتابیس موجود است
            var exists = await _dbContext.AuditRecords
                .AnyAsync(a => a.ProofHash == request.ProofHash);

            return Ok(new { valid = exists });
        }
    }

    public class VerifyDto
    {
        public string ProofHash { get; set; } = string.Empty;
    }
}