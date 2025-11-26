using api_backend.DbContexts;
using api_backend.DTOs.Request.ExerciseSubmissions;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Services.Implements
{
    public class ExerciseSubmissionService : IExerciseSubmissionService
    {
        private readonly AppDbContext _db;
        private readonly IExerciseSubmissionRepository _repo;

        public ExerciseSubmissionService(AppDbContext db, IExerciseSubmissionRepository repo)
        {
            _db = db;
            _repo = repo;
        }

        private static ExerciseSubmissionDto ToDto(ExerciseSubmission s)
            => new ExerciseSubmissionDto
            {
                ExerciseSubmissionId = s.ExerciseSubmissionId,
                LessonId = s.LessonId,
                ExerciseId = s.ExerciseId,
                StudentId = s.StudentId,
                StudentName = s.Student?.FullName,
                MediaId = s.MediaId,
                SubmittedAt = s.SubmittedAt,
                Score = s.Score,
                Comment = s.Comment,
                GradedAt = s.GradedAt
            };

        // Student: Submit exercise
        public async Task<ExerciseSubmissionDto> SubmitExerciseAsync(int lessonId, SubmitExerciseDto dto, int studentId, CancellationToken ct)
        {
            // Check if lesson exists and has exercise
            var lesson = await _db.Lessons
                .Include(l => l.Classroom)
                .FirstOrDefaultAsync(l => l.LessonId == lessonId && l.LessonType == "exercise", ct);

            if (lesson == null)
                throw new KeyNotFoundException("Bài học không tồn tại hoặc không phải dạng bài tập.");

            // Check if student is in the classroom
            var isEnrolled = await _db.ClassroomStudents
                .AnyAsync(cs => cs.ClassroomId == lesson.ClassroomId && cs.StudentId == studentId, ct);

            if (!isEnrolled)
                throw new UnauthorizedAccessException("Bạn không có quyền nộp bài tập cho lớp này.");

            // Check if media exists
            var mediaExists = await _db.Media.AnyAsync(m => m.MediaId == dto.MediaId, ct);
            if (!mediaExists)
                throw new KeyNotFoundException("Media không tồn tại.");

            // Check if student already submitted
            var existingSubmission = await _repo.GetByStudentAndLessonAsync(studentId, lessonId, ct);
            if (existingSubmission != null)
                throw new InvalidOperationException("Bạn đã nộp bài tập này rồi. Vui lòng xóa bài nộp cũ nếu muốn nộp lại.");

            // Create new submission
            var submission = new ExerciseSubmission
            {
                LessonId = lessonId,
                ExerciseId = lesson.ExerciseId!.Value,
                StudentId = studentId,
                MediaId = dto.MediaId,
                SubmittedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(submission, ct);
            await _repo.SaveChangesAsync(ct);

            // Reload with navigation properties
            var result = await _repo.GetByIdAsync(submission.ExerciseSubmissionId, ct);
            return ToDto(result!);
        }

        // Student: Delete submission
        public async Task<bool> DeleteSubmissionAsync(int submissionId, int studentId, CancellationToken ct)
        {
            var submission = await _db.ExerciseSubmissions
                .FirstOrDefaultAsync(s => s.ExerciseSubmissionId == submissionId, ct);

            if (submission == null)
                return false;

            // Check ownership
            if (submission.StudentId != studentId)
                throw new UnauthorizedAccessException("Bạn không có quyền xóa bài nộp này.");

            // Don't allow deletion if already graded
            if (submission.Score.HasValue || submission.GradedAt.HasValue)
                throw new InvalidOperationException("Không thể xóa bài nộp đã được chấm điểm.");

            _db.ExerciseSubmissions.Remove(submission);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        // Student: Get submission info
        public async Task<ExerciseSubmissionDto?> GetSubmissionInfoAsync(int submissionId, int studentId, CancellationToken ct)
        {
            var submission = await _repo.GetByIdAsync(submissionId, ct);

            if (submission == null)
                return null;

            // Check ownership
            if (submission.StudentId != studentId)
                throw new UnauthorizedAccessException("Bạn không có quyền xem bài nộp này.");

            return ToDto(submission);
        }

        // Student: Get submission by lesson
        public async Task<ExerciseSubmissionDto?> GetSubmissionByStudentAndLessonAsync(int lessonId, int studentId, CancellationToken ct)
        {
            var submission = await _repo.GetByStudentAndLessonAsync(studentId, lessonId, ct);

            if (submission == null)
                return null;

            return ToDto(submission);
        }

        // Tutor: Get submissions by lesson
        public async Task<List<ExerciseSubmissionDto>> GetSubmissionsByLessonAsync(int lessonId, int tutorId, CancellationToken ct)
        {
            // Check if lesson exists and is an exercise
            var lesson = await _db.Lessons
                .Include(l => l.Classroom)
                .FirstOrDefaultAsync(l => l.LessonId == lessonId && l.LessonType == "exercise", ct);

            if (lesson == null)
                throw new KeyNotFoundException("Bài học không tồn tại hoặc không phải dạng bài tập.");

            // Check if tutor owns the classroom
            if (lesson.Classroom?.TutorId != tutorId)
                throw new UnauthorizedAccessException("Bạn không có quyền xem bài nộp của lớp này.");

            var submissions = await _repo.GetSubmissionsByLessonAsync(lessonId, ct);
            return submissions.Select(ToDto).ToList();
        }

        // Tutor: Grade submission
        public async Task<bool> GradeSubmissionAsync(int submissionId, GradeSubmissionDto dto, int tutorId, CancellationToken ct)
        {
            var submission = await _db.ExerciseSubmissions
                .Include(s => s.Lesson)
                    .ThenInclude(l => l.Classroom)
                .FirstOrDefaultAsync(s => s.ExerciseSubmissionId == submissionId, ct);

            if (submission == null)
                return false;

            // Check if tutor owns the classroom
            if (submission.Lesson?.Classroom?.TutorId != tutorId)
                throw new UnauthorizedAccessException("Bạn không có quyền chấm bài nộp này.");

            // Validate score
            if (dto.Score.HasValue && (dto.Score < 0 || dto.Score > 10))
                throw new ArgumentException("Điểm phải nằm trong khoảng từ 0 đến 10.");

            // Update submission
            submission.Score = dto.Score;
            submission.Comment = dto.Comment;
            submission.GradedAt = DateTime.UtcNow;

            _db.ExerciseSubmissions.Update(submission);
            await _db.SaveChangesAsync(ct);

            return true;
        }
    }
}
