using backend.DTOs;
using backend.Interfaces.Services;
using backend.Models.AI;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{

    [ApiController]
    [Route("api/ai")]
    public class AIController : ControllerBase
    {
        private readonly IAuditService _auditService;

        public AIController(IAuditService auditService)
        {
            _auditService = auditService;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> Generate(
       [FromBody] AIRequestDto request)
        {
            var result = await _auditService.CreateAuditAsync(
                request.WalletAddress,
                request.Prompt);

            return Ok(result);
        }
    }
}
