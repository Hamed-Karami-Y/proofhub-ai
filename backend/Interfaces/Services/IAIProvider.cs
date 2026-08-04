using backend.Models.AI;

namespace backend.Interfaces.Services
{
    public interface IAIProvider
    {
        Task<AIResponse> GenerateAsync(string prompt);
    }
}
