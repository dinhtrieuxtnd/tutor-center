namespace TutorCenterBackend.Application.DTOs.User
{
    public class CreateAdminRequestDto
    {
        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;
    }
}
