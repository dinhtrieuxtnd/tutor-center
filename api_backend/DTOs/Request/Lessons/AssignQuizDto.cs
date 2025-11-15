namespace api_backend.DTOs.Request.Lessons
{
    public class AssignQuizDto
    {
        public int ClassroomId { get; set; }
        public int QuizId { get; set; }
        public DateTime? StartAt { get; set; }
        public DateTime? EndAt { get; set; }
        public int OrderIndex { get; set; } = 0;
    }
}
