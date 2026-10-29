using backend.Interfaces.Services;
using System.Security.Cryptography;
using System.Text;

namespace backend.Services.Hash
{
    public class HashService : IHashService
    {
        public string ComputeSha256(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                throw new ArgumentException("Input cannot be null or empty.", nameof(input));

            using var sha256 = SHA256.Create();

            var bytes = Encoding.UTF8.GetBytes(input);
            var hash = sha256.ComputeHash(bytes);

            return Convert.ToHexString(hash).ToLowerInvariant();
        }
    }
}
