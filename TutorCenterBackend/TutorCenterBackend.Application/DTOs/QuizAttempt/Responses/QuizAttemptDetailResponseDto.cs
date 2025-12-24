using TutorCenterBackend.Application.DTOs.Quiz.Responses;
using TutorCenterBackend.Application.DTOs.QuizAnswer.Responses;

namespace TutorCenterBackend.Application.DTOs.QuizAttempt.Responses
{
    public class QuizAttemptDetailResponseDto
    {
        public int QuizAttemptId { get; set; }
        public int LessonId { get; set; }
        public int QuizId { get; set; }
        public int StudentId { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public string Status { get; set; } = null!;
        public decimal? ScoreRaw { get; set; }
        public decimal? ScoreScaled10 { get; set; }
        public string StudentName { get; set; } = null!;
        public QuizDetailResponseDto Quiz { get; set; } = null!;
        public List<QuizAnswerResponseDto> Answers { get; set; } = new();
    }
}
