namespace TutorCenterBackend.Application.DTOs.Exercise.Requests
{
    public class ExerciseRequestDto
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public int? AttachMediaId { get; set; }
    }
}