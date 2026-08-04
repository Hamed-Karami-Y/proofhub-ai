namespace backend.Models.AI
{
    public class AIRequest
    {
        public string WalletAddress { get; set; } = string.Empty;

        public string Prompt { get; set; } = string.Empty;

        public string Model { get; set; } = string.Empty;
    }
}
