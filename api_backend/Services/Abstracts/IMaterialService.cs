using api_backend.DTOs.Request.Materials;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IMaterialService
    {
        Task<MaterialDto> CreateAsync(MaterialCreateDto dto, int actorUserId, CancellationToken ct);
        Task<bool> DeleteAsync(int materialId, int actorUserId, CancellationToken ct);
        Task<List<MaterialDto>> ListByLessonAsync(int lessonId, bool onlyPublic, CancellationToken ct);
    }
}
