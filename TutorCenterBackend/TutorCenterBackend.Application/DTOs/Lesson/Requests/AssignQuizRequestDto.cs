namespace TutorCenterBackend.Application.DTOs.Lesson.Requests
{
    public class AssignQuizRequestDto
    {
        public int ClassroomId { get; set; }
        public int QuizId { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public bool ShowQuizAnswers { get; set; }
        public bool ShowQuizScore { get; set; }
        public int OrderIndex { get; set; }
    }
}
