using backend.DTOs;
using backend.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("ai")]
    public class AIController : ControllerBase
    {
        private readonly IAuditService _auditService;

        public AIController(IAuditService auditService)
        {
            _auditService = auditService;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] AIRequestDto request)
        {
            var result = await _auditService.CreateAuditAsync(
                request.WalletAddress,
                request.Prompt);

            return Ok(result);
        }

        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmBlockchain([FromBody] ConfirmBlockchainDto request)
        {
            if (!Guid.TryParse(request.RecordId, out var recordId))
                return BadRequest("Invalid RecordId format");

            var result = await _auditService.ConfirmBlockchainRegistrationAsync(
                recordId,
                request.TransactionHash,
                request.ContractAddress);

            if (!result) return NotFound("Record not found");
            return Ok(new { success = true });
        }
    }
}