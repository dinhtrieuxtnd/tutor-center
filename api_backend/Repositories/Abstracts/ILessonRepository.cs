using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface ILessonRepository : IBaseRepository<Lesson>
    {
        Task<Lesson?> GetByIdAsync(int id, CancellationToken ct);
        Task<List<Lesson>> ListByClassroomAsync(int classroomId, bool onlyPublished, CancellationToken ct);
        Task<bool> IsTeacherOfClassroomAsync(int classroomId, int userId, CancellationToken ct);
    }
}
