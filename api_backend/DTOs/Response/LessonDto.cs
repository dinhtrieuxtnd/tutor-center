namespace api_backend.DTOs.Response
{
    public class LessonDto
    {
        public int LessonId { get; set; }
        public int ClassroomId { get; set; }
        public string LessonType { get; set; } = null!;
        public int OrderIndex { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Lecture fields
        public LectureTreeDto? Lecture { get; set; }
        
        // Exercise fields
        public ExerciseSimpleDto? Exercise { get; set; }
        public DateTime? ExerciseDueAt { get; set; }
        
        // Quiz fields
        public QuizSimpleDto? Quiz { get; set; }
        public DateTime? QuizStartAt { get; set; }
        public DateTime? QuizEndAt { get; set; }
    }
    
    public class LectureTreeDto
    {
        public int LectureId { get; set; }
        public int? ParentId { get; set; }
        public string Title { get; set; } = null!;
        public string? Content { get; set; }
        public int? MediaId { get; set; }
        public DateTime UploadedAt { get; set; }
        public int UploadedBy { get; set; }
        public string UploadedByName { get; set; } = string.Empty;
        public List<LectureTreeDto> Children { get; set; } = new();
    }
    
    public class ExerciseSimpleDto
    {
        public int ExerciseId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int? AttachMediaId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    
    public class QuizSimpleDto
    {
        public int QuizId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int TimeLimitSec { get; set; }
        public int MaxAttempts { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
