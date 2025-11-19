using System;

namespace api_backend.DTOs.Request.Exercises
{
    public class ExerciseCreateDto
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int? AttachMediaId { get; set; }
    }
}
