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

        public ExerciseService(AppDbContext db, IExerciseRepository repo)
        {
            _db = db; 
            _repo = repo;
        }

        private static ExerciseDto ToDto(Exercise e)
            => new ExerciseDto
            {
                ExerciseId = e.ExerciseId,
                LessonId = e.Lessons.FirstOrDefault()?.LessonId,
                Title = e.Title,
                Description = e.Description,
                AttachMediaId = e.AttachMediaId,
                DueAt = e.Lessons.FirstOrDefault()?.ExerciseDueAt,
                CreatedBy = e.CreatedBy,
                CreatedAt = e.CreatedAt,
                SubmissionsCount = e.ExerciseSubmissions?.Count ?? 0
            };

        public async Task<List<ExerciseDto>> ListByTutorAsync(int tutorId, CancellationToken ct)
        {
            var exercises = await _db.Exercises
                .Where(x => x.CreatedBy == tutorId && x.DeletedAt == null)
                .Include(x => x.ExerciseSubmissions)
                .Include(x => x.Lessons)
                .AsNoTracking()
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync(ct);
            return exercises.Select(ToDto).ToList();
        }

        public async Task<ExerciseDto> CreateAsync(ExerciseCreateDto dto, int actorUserId, CancellationToken ct)
        {
            var lesson = await _db.Lessons.Include(x => x.Classroom).FirstOrDefaultAsync(x => x.LessonId == dto.LessonId, ct);
            if (lesson == null) throw new KeyNotFoundException("Lesson không tồn tại.");
            
            // Check if the actor is the tutor of the classroom
            if (lesson.Classroom?.TutorId != actorUserId)
                throw new UnauthorizedAccessException("Chỉ giáo viên phụ trách lớp mới được tạo bài tập.");

            var e = new Exercise
            {
                Title = dto.Title,
                Description = dto.Description,
                AttachMediaId = dto.AttachMediaId,
                CreatedBy = actorUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _repo.AddAsync(e, ct);
            await _repo.SaveChangesAsync(ct);
            
            // Update lesson to reference this exercise
            lesson.ExerciseId = e.ExerciseId;
            lesson.ExerciseDueAt = dto.DueAt;
            lesson.LessonType = "exercise";
            await _repo.SaveChangesAsync(ct);

            var reload = await _db.Exercises
                .Include(x => x.ExerciseSubmissions)
                .Include(x => x.Lessons)
                .FirstAsync(x => x.ExerciseId == e.ExerciseId, ct);

            return ToDto(reload);
        }

        public async Task<bool> UpdateAsync(int exerciseId, ExerciseUpdateDto dto, int actorUserId, CancellationToken ct)
        {
            var e = await _db.Exercises
                .Include(x => x.Lessons)
                .FirstOrDefaultAsync(x => x.ExerciseId == exerciseId && x.DeletedAt == null, ct);
            if (e == null) return false;
            
            // Check if the actor is the creator of the exercise
            if (e.CreatedBy != actorUserId)
                throw new UnauthorizedAccessException("Chỉ giáo viên tạo bài tập mới được sửa bài tập.");

            if (dto.Title != null) e.Title = dto.Title;
            if (dto.Description != null) e.Description = dto.Description;
            if (dto.AttachMediaId.HasValue) e.AttachMediaId = dto.AttachMediaId;
            e.UpdatedAt = DateTime.UtcNow;
            
            var lesson = e.Lessons.FirstOrDefault();
            if (lesson != null && dto.DueAt.HasValue) lesson.ExerciseDueAt = dto.DueAt;

            await _repo.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteAsync(int exerciseId, int actorUserId, CancellationToken ct)
        {
            var e = await _db.Exercises
                .FirstOrDefaultAsync(x => x.ExerciseId == exerciseId && x.DeletedAt == null, ct);
            if (e == null) return false;
            
            // Check if the actor is the creator of the exercise
            if (e.CreatedBy != actorUserId)
                throw new UnauthorizedAccessException("Chỉ giáo viên tạo bài tập mới được xóa bài tập.");

            // Soft delete
            e.DeletedAt = DateTime.UtcNow;
            await _repo.SaveChangesAsync(ct);
            return true;
        }
    }
}
