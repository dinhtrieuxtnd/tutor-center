namespace api_backend.DTOs.Request.Media
{
    public class UploadMediaForm
    {
        public IFormFile File { get; set; } = null!;
        public string? Visibility { get; set; } = "private";
    }
}
