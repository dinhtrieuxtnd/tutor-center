using api_backend.DbContexts;
using api_backend.DTOs.Request.Exercises;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Services.Implements
{
    public class ExerciseService : IExerciseService
    {
        private readonly AppDbContext _db;
        private readonly IExerciseRepository _repo;
        private readonly IExerciseSubmissionRepository _subRepo;

        public ExerciseService(AppDbContext db, IExerciseRepository repo, IExerciseSubmissionRepository subRepo)
        {
            _db = db; _repo = repo; _subRepo = subRepo;
        }

        private static ExerciseDto ToDto(Exercise e)
            => new ExerciseDto
            {
                ExerciseId = e.ExerciseId,
                LessonId = e.LessonId,
                Title = e.Title,
                Description = e.Description,
                AttachMediaId = e.AttachMediaId,
                DueAt = e.DueAt,
                CreatedBy = e.CreatedBy,
                CreatedAt = e.CreatedAt,
                SubmissionsCount = e.ExerciseSubmissions?.Count ?? 0
            };

        private static ExerciseSubmissionDto ToDto(ExerciseSubmission s)
            => new ExerciseSubmissionDto
            {
                SubmissionId = s.SubmissionId,
                ExerciseId = s.ExerciseId,
                StudentId = s.StudentId,
                MediaId = s.MediaId,
                SubmittedAt = s.SubmittedAt,
                Score = s.Score,
                Comment = s.Comment,
                GradedBy = s.GradedBy,
                GradedAt = s.GradedAt
            };

        public async Task<ExerciseDto> CreateAsync(ExerciseCreateDto dto, int actorUserId, CancellationToken ct)
        {
            if (!await _repo.IsTeacherOfLessonAsync(dto.LessonId, actorUserId, ct))
                throw new UnauthorizedAccessException("Chỉ giáo viên phụ trách lớp mới được tạo bài tập.");

            var e = new Exercise
            {
                LessonId = dto.LessonId,
                Title = dto.Title,
                Description = dto.Description,
                AttachMediaId = dto.AttachMediaId,
                DueAt = dto.DueAt,
                CreatedBy = actorUserId,
                CreatedAt = DateTime.UtcNow
            };
            await _repo.AddAsync(e, ct);
            await _repo.SaveChangesAsync(ct);

            var reload = await _db.Exercises
                .Include(x => x.ExerciseSubmissions)
                .FirstAsync(x => x.ExerciseId == e.ExerciseId, ct);

            return ToDto(reload);
        }

        public async Task<bool> UpdateAsync(int exerciseId, ExerciseUpdateDto dto, int actorUserId, CancellationToken ct)
        {
            var e = await _db.Exercises.FirstOrDefaultAsync(x => x.ExerciseId == exerciseId, ct);
            if (e == null) return false;
            if (!await _repo.IsTeacherOfLessonAsync(e.LessonId ?? 0, actorUserId, ct))
                throw new UnauthorizedAccessException("Chỉ giáo viên phụ trách lớp mới được sửa bài tập.");

            if (dto.Title != null) e.Title = dto.Title;
            if (dto.Description != null) e.Description = dto.Description;
            if (dto.AttachMediaId.HasValue) e.AttachMediaId = dto.AttachMediaId;
            if (dto.DueAt.HasValue) e.DueAt = dto.DueAt;

            await _repo.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteAsync(int exerciseId, int actorUserId, CancellationToken ct)
        {
            var e = await _db.Exercises.FirstOrDefaultAsync(x => x.ExerciseId == exerciseId, ct);
            if (e == null) return false;
            if (!await _repo.IsTeacherOfLessonAsync(e.LessonId ?? 0, actorUserId, ct))
                throw new UnauthorizedAccessException("Chỉ giáo viên phụ trách lớp mới được xóa bài tập.");

            _db.Exercises.Remove(e);
            await _repo.SaveChangesAsync(ct);
            return true;
        }

        public async Task<ExerciseDto?> GetAsync(int exerciseId, CancellationToken ct)
        {
            var e = await _db.Exercises
                .Include(x => x.ExerciseSubmissions)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.ExerciseId == exerciseId, ct);
            return e == null ? null : ToDto(e);
        }

        public async Task<List<ExerciseDto>> ListByLessonAsync(int lessonId, CancellationToken ct)
        {
            var list = await _db.Exercises
                .Include(x => x.ExerciseSubmissions)
                .AsNoTracking()
                .Where(x => x.LessonId == lessonId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync(ct);
            return list.Select(ToDto).ToList();
        }

        public async Task<ExerciseSubmissionDto> SubmitAsync(int exerciseId, SubmissionCreateDto dto, int studentId, CancellationToken ct)
        {
            var e = await _db.Exercises.AsNoTracking().FirstOrDefaultAsync(x => x.ExerciseId == exerciseId, ct);
            if (e == null) throw new KeyNotFoundException("Exercise không tồn tại.");
            if (!await _repo.IsStudentOfLessonAsync(e.LessonId ?? 0, studentId, ct))
                throw new UnauthorizedAccessException("Bạn không thuộc lớp của bài học này.");

            var exist = await _db.ExerciseSubmissions
                .FirstOrDefaultAsync(s => s.ExerciseId == exerciseId && s.StudentId == studentId, ct);

            if (exist == null)
            {
                exist = new ExerciseSubmission
                {
                    ExerciseId = exerciseId,
                    StudentId = studentId,
                    MediaId = dto.MediaId,
                    SubmittedAt = DateTime.UtcNow,
                    Comment = dto.Comment
                };
                await _subRepo.AddAsync(exist, ct);
            }
            else
            {
                exist.MediaId = dto.MediaId;
                exist.SubmittedAt = DateTime.UtcNow;
                exist.Comment = dto.Comment;
                exist.Score = null;
                exist.GradedBy = null;
                exist.GradedAt = null;
            }

            await _subRepo.SaveChangesAsync(ct);
            var saved = await _db.ExerciseSubmissions.AsNoTracking().FirstAsync(s => s.SubmissionId == exist.SubmissionId, ct);
            return ToDto(saved);
        }

        public async Task<ExerciseSubmissionDto?> GetMySubmissionAsync(int exerciseId, int studentId, CancellationToken ct)
        {
            var s = await _subRepo.GetByExerciseAndStudentAsync(exerciseId, studentId, ct);
            return s == null ? null : ToDto(s);
        }

        public async Task<List<ExerciseSubmissionDto>> ListSubmissionsAsync(int exerciseId, int actorUserId, CancellationToken ct)
        {
            var ex = await _repo.GetByIdAsync(exerciseId, ct);
            if (ex == null) return new List<ExerciseSubmissionDto>();
            if (!await _repo.IsTeacherOfLessonAsync(ex.LessonId ?? 0, actorUserId, ct))
                throw new UnauthorizedAccessException("Chỉ giáo viên phụ trách lớp mới được xem danh sách nộp bài.");

            var list = await _subRepo.ListByExerciseAsync(exerciseId, ct);
            return list.Select(ToDto).ToList();
        }

        public async Task<bool> GradeAsync(int submissionId, GradeSubmissionDto dto, int graderUserId, CancellationToken ct)
        {
            var s = await _db.ExerciseSubmissions
                .Include(x => x.Exercise)
                .FirstOrDefaultAsync(x => x.SubmissionId == submissionId, ct);
            if (s == null) return false;

            if (!await _repo.IsTeacherOfLessonAsync(s.Exercise.LessonId ?? 0, graderUserId, ct))
                throw new UnauthorizedAccessException("Chỉ giáo viên phụ trách lớp mới được chấm điểm.");

            s.Score = dto.Score;
            if (dto.Comment != null) s.Comment = dto.Comment;
            s.GradedBy = graderUserId;
            s.GradedAt = DateTime.UtcNow;

            await _subRepo.SaveChangesAsync(ct);
            return true;
        }
    }
}
