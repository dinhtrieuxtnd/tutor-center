using api_backend.DTOs.Request.Lessons;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface ILessonService
    {
        Task<LessonDto> CreateAsync(LessonCreateDto dto, int actorUserId, CancellationToken ct);
        Task<bool> UpdateAsync(int lessonId, LessonUpdateDto dto, int actorUserId, CancellationToken ct);
        Task<bool> DeleteAsync(int lessonId, int actorUserId, CancellationToken ct);
        Task<LessonDto?> GetAsync(int lessonId, bool includeDraft, int? actorUserId, CancellationToken ct);
        Task<List<LessonDto>> ListByClassroomAsync(int classroomId, bool onlyPublished, int? actorUserId, CancellationToken ct);
    }
}
