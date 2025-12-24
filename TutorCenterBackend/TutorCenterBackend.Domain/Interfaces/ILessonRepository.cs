using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface ILessonRepository
    {
        Task<Lesson?> GetByIdAsync(int lessonId, CancellationToken ct = default);
        Task<Lesson?> GetByIdWithQuizAsync(int lessonId, CancellationToken ct = default);
        Task<Lesson?> GetByIdWithQuizDetailAsync(int lessonId, CancellationToken ct = default);
        Task AddAsync(Lesson lesson, CancellationToken ct = default);
        Task UpdateAsync(Lesson lesson, CancellationToken ct = default);
        Task<List<Lesson>> GetLessonsByClassroomIdAsync(int classroomId, CancellationToken ct = default);
        Task<bool> ExistsAsync(int classroomId, int? lectureId, int? exerciseId, int? quizId, CancellationToken ct = default);
    }
}
