using System.ComponentModel.DataAnnotations;

namespace api_backend.DTOs.Request.Users
{
    public class CreateTutorRequestDto
    {
        [Required]
        public string FullName { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;

        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = null!;
    }
}
