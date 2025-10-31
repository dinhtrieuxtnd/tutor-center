using System;

namespace api_backend.DTOs.Request.Exercises
{
    public class ExerciseUpdateDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? AttachMediaId { get; set; }
        public DateTime? DueAt { get; set; }
    }
}
