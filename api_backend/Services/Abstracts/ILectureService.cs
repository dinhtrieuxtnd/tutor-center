using api_backend.DTOs.Request.Lectures;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface ILectureService
    {
        Task<LectureDto?> GetAsync(int id, int tutorId, CancellationToken ct);
        Task<(List<LectureDto> items, int total)> QueryAsync(LectureQueryRequest req, int tutorId, CancellationToken ct);
        Task<LectureDto> CreateAsync(LectureCreateRequest dto, int tutorId, CancellationToken ct);
        Task<bool> UpdateAsync(int id, LectureUpdateRequest dto, int tutorId, CancellationToken ct);
        Task<bool> SoftDeleteAsync(int id, int tutorId, CancellationToken ct);
    }
}
