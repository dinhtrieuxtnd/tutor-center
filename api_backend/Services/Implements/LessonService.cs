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
        _db = db;
        _repo = repo;
    }

    private static LessonDto MapToDto(Lesson lesson)
    {
        var dto = new LessonDto
        {
            LessonId = lesson.LessonId,
            ClassroomId = lesson.ClassroomId,
            LessonType = lesson.LessonType,
            OrderIndex = lesson.OrderIndex,
            CreatedAt = lesson.CreatedAt
        };

        // Map Lecture with tree structure
        if (lesson.Lecture != null)
        {
            dto.Lecture = MapLectureTree(lesson.Lecture);
        }

        // Map Exercise
        if (lesson.Exercise != null)
        {
            dto.Exercise = new ExerciseSimpleDto
            {
                ExerciseId = lesson.Exercise.ExerciseId,
                Title = lesson.Exercise.Title,
                Description = lesson.Exercise.Description,
                AttachMediaId = lesson.Exercise.AttachMediaId,
                CreatedBy = lesson.Exercise.CreatedBy,
                CreatedAt = lesson.Exercise.CreatedAt
            };
            dto.ExerciseDueAt = lesson.ExerciseDueAt;
        }

        // Map Quiz
        if (lesson.Quiz != null)
        {
            dto.Quiz = new QuizSimpleDto
            {
                QuizId = lesson.Quiz.QuizId,
                Title = lesson.Quiz.Title,
                Description = lesson.Quiz.Description,
                TimeLimitSec = lesson.Quiz.TimeLimitSec,
                MaxAttempts = lesson.Quiz.MaxAttempts,
                CreatedBy = lesson.Quiz.CreatedBy,
                CreatedAt = lesson.Quiz.CreatedAt
            };
            dto.QuizStartAt = lesson.QuizStartAt;
            dto.QuizEndAt = lesson.QuizEndAt;
        }

        return dto;
    }

    private static LectureTreeDto MapLectureTree(Lecture lecture)
    {
        var dto = new LectureTreeDto
        {
            LectureId = lecture.LectureId,
            ParentId = lecture.ParentId,
            Title = lecture.Title,
            Content = lecture.Content,
            MediaId = lecture.MediaId,
            UploadedAt = lecture.UploadedAt,
            UploadedBy = lecture.UploadedBy,
            UploadedByName = lecture.UploadedByNavigation?.FullName ?? string.Empty
        };

        // Recursively map children
        if (lecture.InverseParent != null && lecture.InverseParent.Any())
        {
            dto.Children = lecture.InverseParent
                .Where(l => l.DeletedAt == null)
                .Select(MapLectureTree)
                .ToList();
        }

        return dto;
    }

    public async Task<LessonDto> AssignLectureAsync(AssignLectureDto dto, int tutorId, CancellationToken ct)
    {
        // Check if tutor owns the classroom
        if (!await _repo.IsTeacherOfClassroomAsync(dto.ClassroomId, tutorId, ct))
            throw new UnauthorizedAccessException("Bạn không có quyền thao tác với lớp học này.");

        // Check if lecture exists, is root (parentId = null), and owned by tutor
        if (!await _repo.LectureExistsAndIsRootAsync(dto.LectureId, tutorId, ct))
            throw new InvalidOperationException("Lecture không tồn tại, không phải lecture gốc hoặc bạn không sở hữu.");

        var lesson = new Lesson
        {
            ClassroomId = dto.ClassroomId,
            LessonType = "lecture",
            LectureId = dto.LectureId,
            OrderIndex = dto.OrderIndex,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Lessons.Add(lesson);
        await _db.SaveChangesAsync(ct);

        // Reload with details
        var saved = await _repo.GetByIdWithDetailsAsync(lesson.LessonId, ct);
        return MapToDto(saved!);
    }

    public async Task<LessonDto> AssignExerciseAsync(AssignExerciseDto dto, int tutorId, CancellationToken ct)
    {
        // Check if tutor owns the classroom
        if (!await _repo.IsTeacherOfClassroomAsync(dto.ClassroomId, tutorId, ct))
            throw new UnauthorizedAccessException("Bạn không có quyền thao tác với lớp học này.");

        // Check if exercise exists and owned by tutor
        if (!await _repo.ExerciseExistsAndOwnedByTutorAsync(dto.ExerciseId, tutorId, ct))
            throw new InvalidOperationException("Exercise không tồn tại hoặc bạn không sở hữu.");

        var lesson = new Lesson
        {
            ClassroomId = dto.ClassroomId,
            LessonType = "exercise",
            ExerciseId = dto.ExerciseId,
            ExerciseDueAt = dto.DueAt,
            OrderIndex = dto.OrderIndex,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Lessons.Add(lesson);
        await _db.SaveChangesAsync(ct);

        // Reload with details
        var saved = await _repo.GetByIdWithDetailsAsync(lesson.LessonId, ct);
        return MapToDto(saved!);
    }

    public async Task<LessonDto> AssignQuizAsync(AssignQuizDto dto, int tutorId, CancellationToken ct)
    {
        // Check if tutor owns the classroom
        if (!await _repo.IsTeacherOfClassroomAsync(dto.ClassroomId, tutorId, ct))
            throw new UnauthorizedAccessException("Bạn không có quyền thao tác với lớp học này.");

        // Check if quiz exists and owned by tutor
        if (!await _repo.QuizExistsAndOwnedByTutorAsync(dto.QuizId, tutorId, ct))
            throw new InvalidOperationException("Quiz không tồn tại hoặc bạn không sở hữu.");

        var lesson = new Lesson
        {
            ClassroomId = dto.ClassroomId,
            LessonType = "quiz",
            QuizId = dto.QuizId,
            QuizStartAt = dto.StartAt,
            QuizEndAt = dto.EndAt,
            OrderIndex = dto.OrderIndex,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Lessons.Add(lesson);
        await _db.SaveChangesAsync(ct);

        // Reload with details
        var saved = await _repo.GetByIdWithDetailsAsync(lesson.LessonId, ct);
        return MapToDto(saved!);
    }

    public async Task<bool> SoftDeleteAsync(int lessonId, int tutorId, CancellationToken ct)
    {
        var lesson = await _db.Lessons
            .FirstOrDefaultAsync(l => l.LessonId == lessonId && l.DeletedAt == null, ct);

        if (lesson == null)
            return false;

        // Check if tutor owns the classroom
        if (!await _repo.IsTeacherOfClassroomAsync(lesson.ClassroomId, tutorId, ct))
            throw new UnauthorizedAccessException("Bạn không có quyền thao tác với lớp học này.");

        lesson.DeletedAt = DateTime.UtcNow;
        lesson.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<LessonDto>> ListByClassroomAsync(int classroomId, int? userId, CancellationToken ct)
    {
        // Check access: user must be tutor or student of classroom
        if (userId.HasValue)
        {
            var isTutor = await _repo.IsTeacherOfClassroomAsync(classroomId, userId.Value, ct);
            var isStudent = await _repo.IsStudentOfClassroomAsync(classroomId, userId.Value, ct);

            if (!isTutor && !isStudent)
                throw new UnauthorizedAccessException("Bạn không có quyền xem danh sách bài học của lớp này.");
        }

        var lessons = await _repo.ListByClassroomWithDetailsAsync(classroomId, ct);
        return lessons.Select(MapToDto).ToList();
    }
}
