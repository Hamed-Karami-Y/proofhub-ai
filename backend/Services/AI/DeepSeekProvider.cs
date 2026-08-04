using backend.Interfaces.Services;
using backend.Models.AI;

namespace backend.Services.AI
{
    public class DeepSeekProvider : IAIProvider
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public DeepSeekProvider(
            HttpClient httpClient,
            IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<AIResponse> GenerateAsync(string prompt)
        {
            var apiKey = _configuration["Groq:ApiKey"];
            var model = _configuration["Groq:Model"] ?? "llama-3.3-70b-versatile";

            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue(
                    "Bearer",
                    apiKey);

            var request = new
            {
                model,
                messages = new[]
                {
                new
                {
                    role = "user",
                    content = prompt
                }
            }
            };

            var response = await _httpClient.PostAsJsonAsync(
                "https://api.groq.com/openai/v1/chat/completions", 
                request);

            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<DeepSeekChatResponse>();

            return new AIResponse
            {
                Model = model,
                ModelVersion = model,
                Output = result?.Choices.FirstOrDefault()?.Message.Content
                         ?? string.Empty
            };
        }
    }
}
