namespace TutorCenterBackend.Application.DTOs.ExerciseSubmission.Requests
{
    public class GradeSubmissionRequestDto
    {
        public required decimal Score { get; set; }
        public string? Comment { get; set; }
    }
}
