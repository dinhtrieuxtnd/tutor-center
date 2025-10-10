namespace api_backend.DTOs.Response
{
    public class AuthTokensDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public long ExpiresIn { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
        public string TokenType { get; set; } = "Bearer";
    }
}
