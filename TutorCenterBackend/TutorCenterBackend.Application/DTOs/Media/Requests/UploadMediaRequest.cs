using Microsoft.AspNetCore.Http;

namespace TutorCenterBackend.Application.DTOs.Media.Requests
{
    public class UploadMediaRequest
    {
        public IFormFile File { get; set; } = null!;
        public string Visibility { get; set; } = "private";
    }
}
