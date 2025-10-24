using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IMaterialRepository : IBaseRepository<Material>
    {
        Task<List<Material>> ListByLessonAsync(int lessonId, CancellationToken ct);
    }
}
