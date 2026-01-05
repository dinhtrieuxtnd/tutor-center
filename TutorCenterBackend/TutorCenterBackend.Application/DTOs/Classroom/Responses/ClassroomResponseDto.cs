using TutorCenterBackend.Application.DTOs.Profile.Responses;

namespace TutorCenterBackend.Application.DTOs.Classroom.Responses
{
    public class ClassroomResponseDto
    {
        public required int Id { get; set; }

        public required int TutorId { get; set; }

        public UserResponseDto? Tutor { get; set; }

        public required string Name { get; set; }

        public string? Description { get; set; }

        public required decimal Price { get; set; }

        public int? CoverMediaId { get; set; }

        public string? CoverImageUrl { get; set; }

        public bool IsArchived { get; set; }

        public required DateTime CreatedAt { get; set; }

        public required DateTime UpdatedAt { get; set; }
        
        public DateTime? DeletedAt { get; set; }

        public bool? HasPaid { get; set; }
    }
}