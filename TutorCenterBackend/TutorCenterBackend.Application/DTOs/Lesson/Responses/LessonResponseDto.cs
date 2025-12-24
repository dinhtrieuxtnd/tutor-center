using TutorCenterBackend.Application.DTOs.Exercise.Responses;
using TutorCenterBackend.Application.DTOs.Lecture.Response;
using TutorCenterBackend.Application.DTOs.Quiz.Responses;

namespace TutorCenterBackend.Application.DTOs.Lesson.Responses
{
    public class LessonResponseDto
    {
        public int Id { get; set; }
        public int ClassroomId { get; set; }
        public string LessonType { get; set; } = null!;
        public int OrderIndex { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // For Lecture
        public LectureWithChildrenResponseDto? Lecture { get; set; }
        
        // For Exercise
        public ExerciseResponseDto? Exercise { get; set; }
        public DateTime? ExerciseDueAt { get; set; }
        
        // For Quiz (basic info only for students before start time)
        public QuizBasicInfoResponseDto? Quiz { get; set; }
    }
}
