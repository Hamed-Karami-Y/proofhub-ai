namespace backend.DTOs
{
    public class AIRequestDto
    {
        public string WalletAddress { get; set; } = string.Empty;

        public string Prompt { get; set; } = string.Empty;
    }
}
