using api_backend.DbContexts;
using api_backend.DTOs.Request.Lessons;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Services.Implements;

public class LessonService : ILessonService
{
    private readonly AppDbContext _db;
    private readonly ILessonRepository _repo;

    public LessonService(AppDbContext db, ILessonRepository repo)
    {
        _db = db; _repo = repo;
    }

    private static LessonDto Map(Lesson e) => new()
    {
        LessonId = e.LessonId,
        ClassroomId = e.ClassroomId,
        Title = e.Title,
        Content = e.Content,
        LessonType = e.LessonType,
        OrderIndex = e.OrderIndex,
        PublishedAt = e.PublishedAt
    };

    public async Task<LessonDto> CreateAsync(LessonCreateDto dto, int actorUserId, CancellationToken ct)
    {
        // Chỉ giáo viên phụ trách Classroom được tạo
        var isTeacher = await _repo.IsTeacherOfClassroomAsync(dto.ClassroomId, actorUserId, ct);
        if (!isTeacher) throw new UnauthorizedAccessException("Chỉ giáo viên phụ trách lớp mới được tạo bài học.");

        var e = new Lesson
        {
            ClassroomId = dto.ClassroomId,
            Title = dto.Title,
            Content = dto.Content,
            LessonType = dto.LessonType ?? "lesson",
            OrderIndex = dto.OrderIndex,
            PublishedAt = dto.Publish ? DateTime.UtcNow : null
        };

        _db.Lessons.Add(e);
        await _db.SaveChangesAsync(ct);
        return Map(e);
    }

    public async Task<bool> UpdateAsync(int lessonId, LessonUpdateDto dto, int actorUserId, CancellationToken ct)
    {
        var e = await _db.Lessons.FirstOrDefaultAsync(x => x.LessonId == lessonId, ct);
        if (e == null) return false;

        var isTeacher = await _repo.IsTeacherOfClassroomAsync(e.ClassroomId, actorUserId, ct);
        if (!isTeacher) throw new UnauthorizedAccessException("Chỉ giáo viên phụ trách lớp mới được sửa bài học.");

        if (dto.Title != null) e.Title = dto.Title;
        if (dto.Content != null) e.Content = dto.Content;
        if (dto.LessonType != null) e.LessonType = dto.LessonType;
        if (dto.OrderIndex.HasValue) e.OrderIndex = dto.OrderIndex.Value;
        if (dto.Publish.HasValue) e.PublishedAt = dto.Publish.Value ? (e.PublishedAt ?? DateTime.UtcNow) : null;

        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteAsync(int lessonId, int actorUserId, CancellationToken ct)
    {
        var e = await _db.Lessons.FirstOrDefaultAsync(x => x.LessonId == lessonId, ct);
        if (e == null) return false;

        var isTeacher = await _repo.IsTeacherOfClassroomAsync(e.ClassroomId, actorUserId, ct);
        if (!isTeacher) throw new UnauthorizedAccessException("Chỉ giáo viên phụ trách lớp mới được xóa bài học.");

        _db.Lessons.Remove(e);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<LessonDto?> GetAsync(int lessonId, bool includeDraft, int? actorUserId, CancellationToken ct)
    {
        var e = await _db.Lessons.AsNoTracking().FirstOrDefaultAsync(x => x.LessonId == lessonId, ct);
        if (e == null) return null;
        if (!includeDraft && e.PublishedAt == null) return null; // ẩn draft

        return Map(e);
    }

    public async Task<List<LessonDto>> ListByClassroomAsync(int classroomId, bool onlyPublished, int? actorUserId, CancellationToken ct)
    {
        var list = await _repo.ListByClassroomAsync(classroomId, onlyPublished, ct);
        return list.Select(Map).ToList();
    }
}
