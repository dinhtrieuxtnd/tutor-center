namespace TutorCenterBackend.Application.DTOs.ExerciseSubmission.Requests
{
    public class SubmitExerciseRequestDto
    {
        public required int LessonId { get; set; }
        public required int ExerciseId { get; set; }
        public required int MediaId { get; set; }
    }
}
