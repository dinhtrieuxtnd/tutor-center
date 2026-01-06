namespace TutorCenterBackend.Application.DTOs.Lesson.Requests
{
    public class UpdateLessonRequestDto
    {
        public int LessonId { get; set; }
        public int? OrderIndex { get; set; }
        public DateTime? ExerciseDueAt { get; set; }
        public DateTime? QuizStartAt { get; set; }
        public DateTime? QuizEndAt { get; set; }
        public bool? ShowQuizAnswers { get; set; }
        public bool? ShowQuizScore { get; set; }
    }
}
