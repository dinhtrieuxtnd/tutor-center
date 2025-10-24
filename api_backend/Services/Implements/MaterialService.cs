using api_backend.DbContexts;
using api_backend.DTOs.Request.Materials;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Services.Implements;

public class MaterialService : IMaterialService
{
    private readonly AppDbContext _db;
    private readonly ILessonRepository _lessonRepo;
    private readonly IMediaRepository _mediaRepo;

    public MaterialService(AppDbContext db, ILessonRepository lessonRepo, IMediaRepository mediaRepo)
    {
        _db = db; _lessonRepo = lessonRepo; _mediaRepo = mediaRepo;
    }

    private string BuildUrl(Medium m) =>
        $"/media/{m.MediaId}"; // TODO: thay bằng IStorageService.GetFileUrl nếu bạn có

    public async Task<MaterialDto> CreateAsync(MaterialCreateDto dto, int actorUserId, CancellationToken ct)
    {
        var lesson = await _db.Lessons.FirstOrDefaultAsync(x => x.LessonId == dto.LessonId, ct)
                     ?? throw new ArgumentException("Lesson không tồn tại.");

        // Chỉ giáo viên phụ trách lớp được thêm tài liệu
        var isTeacher = await _lessonRepo.IsTeacherOfClassroomAsync(lesson.ClassroomId, actorUserId, ct);
        if (!isTeacher) throw new UnauthorizedAccessException("Chỉ giáo viên phụ trách lớp mới được thêm tài liệu.");

        var media = await _mediaRepo.GetAsync(dto.MediaId, ct) ?? throw new ArgumentException("MediaId không hợp lệ.");

        var e = new Material
        {
            LessonId = dto.LessonId,
            Title = dto.Title,
            MediaId = media.MediaId,
            UploadedBy = actorUserId,
            UploadedAt = DateTime.UtcNow
        };

        _db.Materials.Add(e);
        await _db.SaveChangesAsync(ct);

        return new MaterialDto
        {
            MaterialId = e.MaterialId,
            LessonId = e.LessonId,
            Title = e.Title,
            MediaId = e.MediaId,
            MimeType = media.MimeType,
            Url = BuildUrl(media),
            UploadedAt = e.UploadedAt
        };
    }

    public async Task<bool> DeleteAsync(int materialId, int actorUserId, CancellationToken ct)
    {
        var e = await _db.Materials.Include(m => m.Lesson).FirstOrDefaultAsync(x => x.MaterialId == materialId, ct);
        if (e == null) return false;

        var isTeacher = await _lessonRepo.IsTeacherOfClassroomAsync(e.Lesson!.ClassroomId, actorUserId, ct);
        if (!isTeacher) throw new UnauthorizedAccessException("Chỉ giáo viên phụ trách lớp mới được xóa tài liệu.");

        _db.Materials.Remove(e);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<MaterialDto>> ListByLessonAsync(int lessonId, bool onlyPublic, CancellationToken ct)
    {
        var list = await _db.Materials
                     .Include(m => m.Media)
                     .Where(m => m.LessonId == lessonId)
                     .OrderByDescending(m => m.UploadedAt)
                     .ToListAsync(ct);

        if (onlyPublic)
            list = list.Where(m => m.Media.Visibility == "public").ToList();

        return list.Select(m => new MaterialDto
        {
            MaterialId = m.MaterialId,
            LessonId = m.LessonId,
            Title = m.Title,
            MediaId = m.MediaId,
            MimeType = m.Media.MimeType,
            Url = BuildUrl(m.Media),
            UploadedAt = m.UploadedAt
        }).ToList();
    }
}
