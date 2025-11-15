using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface ILectureRepository : IBaseRepository<Lecture>
    {
        Task<Lecture?> GetByIdAsync(int id, int tutorId, CancellationToken ct = default);
        Task<List<Lecture>> QueryAsync(string? q, int tutorId, int skip, int take, CancellationToken ct = default);
        Task<int> CountAsync(string? q, int tutorId, CancellationToken ct = default);
        Task<bool> IsOwnerAsync(int lectureId, int tutorId, CancellationToken ct = default);
    }
}
