using System.Security.Cryptography;

namespace api_backend.Services.Implements
{
    public class PasswordHasher
    {
        private const int SaltSize = 16;
        private const int HashSize = 32;
        private const int Iterations = 100_000;

        public byte[] HashPassword(string password)
        {
            using var rng = RandomNumberGenerator.Create();
            var salt = new byte[SaltSize];
            rng.GetBytes(salt);
            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
            var hash = pbkdf2.GetBytes(HashSize);
            var result = new byte[SaltSize + HashSize];
            Buffer.BlockCopy(salt, 0, result, 0, SaltSize);
            Buffer.BlockCopy(hash, 0, result, SaltSize, HashSize);
            return result;
        }

        public bool Verify(string password, byte[] passwordHash)
        {
            if (passwordHash == null || passwordHash.Length != SaltSize + HashSize) return false;
            var salt = new byte[SaltSize];
            Buffer.BlockCopy(passwordHash, 0, salt, 0, SaltSize);
            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
            var computed = pbkdf2.GetBytes(HashSize);
            for (int i = 0; i < HashSize; i++)
                if (computed[i] != passwordHash[SaltSize + i]) return false;
            return true;
        }
    }
}
