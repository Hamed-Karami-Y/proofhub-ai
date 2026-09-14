namespace backend.Services.AI
{
    public class GroqChatResponse
    {
        public List<Choice> Choices { get; set; } = [];
    }

    public class Choice
    {
        public Message Message { get; set; } = new();
    }

    public class Message
    {
        public string Content { get; set; } = string.Empty;
    }
}
