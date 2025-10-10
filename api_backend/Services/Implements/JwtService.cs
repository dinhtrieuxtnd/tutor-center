using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using api_backend.Configurations;
using api_backend.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace api_backend.Services.Implements
{
    public class JwtService : api_backend.Services.Abstracts.IJwtService
    {
        private readonly JwtSettings _settings;

        public JwtService(IOptions<JwtSettings> options)
        {
            _settings = options.Value;
        }

        public (string token, DateTime expires) GenerateAccessToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.FullName)
            };
            if (user.Role != null)
            {
                claims.Add(new Claim(ClaimTypes.Role, user.Role.Name));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(_settings.ExpiresMinutes);

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );
            return (new JwtSecurityTokenHandler().WriteToken(token), expires);
        }

        public (string plain, string hash) GenerateRefreshToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(64);
            var plain = Convert.ToBase64String(bytes);
            using var sha = SHA256.Create();
            var hash = Convert.ToHexString(sha.ComputeHash(Encoding.UTF8.GetBytes(plain)));
            return (plain, hash);
        }
    }
}
