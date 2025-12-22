namespace TutorCenterBackend.Application.DTOs.Exercise.Responses
{
    public class ExerciseResponseDto
    {
        public int Id { get; set; }

        public required string Title { get; set; }

        public string? Description { get; set; }

        public int? AttachMediaId { get; set; }

        public string? AttachMediaUrl { get; set; }

        public int CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public DateTime? DeletedAt { get; set; }
    }
}