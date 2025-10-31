using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IExerciseRepository : IBaseRepository<Exercise>
    {
        Task<Exercise?> GetByIdAsync(int id, CancellationToken ct);
        Task<List<Exercise>> ListByLessonAsync(int lessonId, CancellationToken ct);
        Task<bool> IsTeacherOfLessonAsync(int lessonId, int userId, CancellationToken ct);
        Task<bool> IsStudentOfLessonAsync(int lessonId, int studentId, CancellationToken ct);
    }
}
