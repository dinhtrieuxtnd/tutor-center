using api_backend.Entities;

namespace api_backend.Services.Abstracts
{
    public interface IJwtService
    {
        (string token, DateTime expires) GenerateAccessToken(User user);
        (string plain, string hash) GenerateRefreshToken();
    }
}
