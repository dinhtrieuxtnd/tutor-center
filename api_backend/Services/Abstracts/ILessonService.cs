using api_backend.DTOs.Request.Lessons;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface ILessonService
    {
        // Tutor APIs
        Task<LessonDto> AssignLectureAsync(AssignLectureDto dto, int tutorId, CancellationToken ct);
        Task<LessonDto> AssignExerciseAsync(AssignExerciseDto dto, int tutorId, CancellationToken ct);
        Task<LessonDto> AssignQuizAsync(AssignQuizDto dto, int tutorId, CancellationToken ct);
        Task<bool> SoftDeleteAsync(int lessonId, int tutorId, CancellationToken ct);
        
        // Common APIs
        Task<List<LessonDto>> ListByClassroomAsync(int classroomId, int? userId, CancellationToken ct);
    }
}
