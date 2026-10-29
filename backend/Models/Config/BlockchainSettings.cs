namespace backend.Models.Config
{
    public class BlockchainSettings
    {
        public string RpcUrl { get; set; } = string.Empty;
        public string PrivateKey { get; set; } = string.Empty;
        public string ContractAddress { get; set; } = string.Empty;
        public string Abi { get; set; } = string.Empty;
    }
    
}
