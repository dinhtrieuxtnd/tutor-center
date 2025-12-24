namespace TutorCenterBackend.Application.DTOs.Lesson.Requests
{
    public class AssignExerciseRequestDto
    {
        public int ClassroomId { get; set; }
        public int ExerciseId { get; set; }
        public DateTime? DueAt { get; set; }
        public int OrderIndex { get; set; }
    }
}
