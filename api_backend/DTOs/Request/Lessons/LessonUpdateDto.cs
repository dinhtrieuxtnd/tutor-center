namespace api_backend.DTOs.Request.Lessons
{
    public class AssignExerciseDto
    {
        public int ClassroomId { get; set; }
        public int ExerciseId { get; set; }
        public DateTime? DueAt { get; set; }
        public int OrderIndex { get; set; } = 0;
    }
}
