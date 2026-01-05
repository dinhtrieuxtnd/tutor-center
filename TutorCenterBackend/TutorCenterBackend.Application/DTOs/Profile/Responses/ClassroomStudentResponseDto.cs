namespace TutorCenterBackend.Application.DTOs.Profile.Responses
{
    public class ClassroomStudentResponseDto
    {
        public int UserId { get; set; }

        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;

        public int RoleId { get; set; }

        public int? AvatarMediaId { get; set; }

        public string? AvatarUrl { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public bool HasPaid { get; set; }

        public DateTime? PaidAt { get; set; }
    }
}
