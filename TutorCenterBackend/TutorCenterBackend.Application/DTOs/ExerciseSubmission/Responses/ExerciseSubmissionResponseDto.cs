namespace TutorCenterBackend.Application.DTOs.ExerciseSubmission.Responses
{
    public class ExerciseSubmissionResponseDto
    {
        public int Id { get; set; }
        public int LessonId { get; set; }
        public int ExerciseId { get; set; }
        public string ExerciseTitle { get; set; } = null!;
        public int StudentId { get; set; }
        public string StudentName { get; set; } = null!;
        public int MediaId { get; set; }
        public string? MediaUrl { get; set; }
        public DateTime SubmittedAt { get; set; }
        public decimal? Score { get; set; }
        public string? Comment { get; set; }
        public DateTime? GradedAt { get; set; }
    }
}
