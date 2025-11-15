using System.ComponentModel.DataAnnotations;

namespace api_backend.DTOs.Request.Media
{
    public class UpdateMediaForm
    {
        [RegularExpression("^(public|private)$", ErrorMessage = "Visibility chỉ được phép là 'public' hoặc 'private'")]
        public string? Visibility { get; set; }
    }
}
