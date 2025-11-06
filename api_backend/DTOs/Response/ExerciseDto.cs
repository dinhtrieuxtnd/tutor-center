using System;

namespace api_backend.DTOs.Response
{
    public class ExerciseDto
    {
        public int ExerciseId { get; set; }
        public int? LessonId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int? AttachMediaId { get; set; }
        public DateTime? DueAt { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }

        public int SubmissionsCount { get; set; }
    }
}
