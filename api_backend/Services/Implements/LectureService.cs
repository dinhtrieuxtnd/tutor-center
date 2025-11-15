using api_backend.DTOs.Request.Lectures;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;

namespace api_backend.Services.Implements
{
    public class LectureService : ILectureService
    {
        private readonly ILectureRepository _repos;

        public LectureService(ILectureRepository repos)
        {
            _repos = repos;
        }

        private static LectureDto Map(Lecture l) => new LectureDto
        {
            LectureId = l.LectureId,
            ParentId = l.ParentId,
            Title = l.Title,
            Content = l.Content,
            MediaId = l.MediaId,
            UploadedAt = l.UploadedAt,
            UploadedBy = l.UploadedBy,
            UploadedByName = l.UploadedByNavigation?.FullName ?? "",
            UpdatedAt = l.UpdatedAt
        };

        public async Task<LectureDto?> GetAsync(int id, int tutorId, CancellationToken ct)
        {
            var lecture = await _repos.GetByIdAsync(id, tutorId, ct);
            if (lecture == null) return null;
            return Map(lecture);
        }

        public async Task<(List<LectureDto> items, int total)> QueryAsync(LectureQueryRequest req, int tutorId, CancellationToken ct)
        {
            var skip = (req.Page - 1) * req.PageSize;
            var lectures = await _repos.QueryAsync(req.Q, tutorId, skip, req.PageSize, ct);
            var total = await _repos.CountAsync(req.Q, tutorId, ct);
            return (lectures.Select(Map).ToList(), total);
        }

        public async Task<LectureDto> CreateAsync(LectureCreateRequest dto, int tutorId, CancellationToken ct)
        {
            var lecture = new Lecture
            {
                ParentId = dto.ParentId,
                Title = dto.Title,
                Content = dto.Content,
                MediaId = dto.MediaId,
                UploadedAt = DateTime.UtcNow,
                UploadedBy = tutorId,
                UpdatedAt = DateTime.UtcNow
            };

            await _repos.AddAsync(lecture, ct);
            await _repos.SaveChangesAsync(ct);

            // Reload with navigation properties
            var created = await _repos.GetByIdAsync(lecture.LectureId, tutorId, ct);
            return Map(created!);
        }

        public async Task<bool> UpdateAsync(int id, LectureUpdateRequest dto, int tutorId, CancellationToken ct)
        {
            var lecture = await _repos.GetByIdAsync(id, tutorId, ct);
            if (lecture == null) return false;

            lecture.ParentId = dto.ParentId;
            lecture.Title = dto.Title;
            lecture.Content = dto.Content;
            lecture.MediaId = dto.MediaId;
            lecture.UpdatedAt = DateTime.UtcNow;

            await _repos.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> SoftDeleteAsync(int id, int tutorId, CancellationToken ct)
        {
            var lecture = await _repos.GetByIdAsync(id, tutorId, ct);
            if (lecture == null) return false;

            lecture.DeletedAt = DateTime.UtcNow;
            await _repos.SaveChangesAsync(ct);
            return true;
        }
    }
}
