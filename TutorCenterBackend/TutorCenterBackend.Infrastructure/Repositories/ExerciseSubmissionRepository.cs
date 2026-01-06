using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class ExerciseSubmissionRepository(AppDbContext context) : IExerciseSubmissionRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<ExerciseSubmission?> GetByIdAsync(int submissionId, CancellationToken ct = default)
        {
            return await _context.ExerciseSubmissions
                .FirstOrDefaultAsync(s => s.ExerciseSubmissionId == submissionId, ct);
        }

        public async Task<ExerciseSubmission?> GetByIdWithDetailsAsync(int submissionId, CancellationToken ct = default)
        {
            return await _context.ExerciseSubmissions
                .Include(s => s.Exercise)
                .Include(s => s.Student)
                .Include(s => s.Media)
                .Include(s => s.Lesson)
                    .ThenInclude(l => l.Classroom)
                .FirstOrDefaultAsync(s => s.ExerciseSubmissionId == submissionId, ct);
        }

        public async Task<ExerciseSubmission?> FindSubmissionAsync(int lessonId, int exerciseId, int studentId, CancellationToken ct = default)
        {
            return await _context.ExerciseSubmissions
                .FirstOrDefaultAsync(s => 
                    s.LessonId == lessonId && 
                    s.ExerciseId == exerciseId && 
                    s.StudentId == studentId, ct);
        }

        public async Task CreateAsync(ExerciseSubmission submission, CancellationToken ct = default)
        {
            await _context.ExerciseSubmissions.AddAsync(submission, ct);
            await _context.SaveChangesAsync(ct);
        }

        public async Task UpdateAsync(ExerciseSubmission submission, CancellationToken ct = default)
        {
            _context.ExerciseSubmissions.Update(submission);
            await _context.SaveChangesAsync(ct);
        }

        public async Task DeleteAsync(ExerciseSubmission submission, CancellationToken ct = default)
        {
            _context.ExerciseSubmissions.Remove(submission);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<IEnumerable<ExerciseSubmission>> GetSubmissionsByStudentAsync(int studentId, CancellationToken ct = default)
        {
            return await _context.ExerciseSubmissions
                .Include(s => s.Exercise)
                .Include(s => s.Media)
                .Include(s => s.Lesson)
                .Where(s => s.StudentId == studentId)
                .OrderByDescending(s => s.SubmittedAt)
                .ToListAsync(ct);
        }

        public async Task<IEnumerable<ExerciseSubmission>> GetSubmissionsByExerciseAsync(int exerciseId, CancellationToken ct = default)
        {
            return await _context.ExerciseSubmissions
                .Include(s => s.Student)
                .Include(s => s.Media)
                .Include(s => s.Lesson)
                .Where(s => s.ExerciseId == exerciseId)
                .OrderByDescending(s => s.SubmittedAt)
                .ToListAsync(ct);
        }

        public async Task<ExerciseSubmission?> GetSubmissionByLessonAndStudentAsync(int lessonId, int studentId, CancellationToken ct = default)
        {
            return await _context.ExerciseSubmissions
                .Include(s => s.Student)
                .Include(s => s.Media)
                .Include(s => s.Lesson)
                    .ThenInclude(l => l.Exercise)
                .FirstOrDefaultAsync(s => s.LessonId == lessonId && s.StudentId == studentId, ct);
        }

        public async Task<bool> IsStudentInClassroomAsync(int studentId, int lessonId, CancellationToken ct = default)
        {
            return await _context.Lessons
                .Include(l => l.Classroom)
                    .ThenInclude(c => c.ClassroomStudents)
                .Where(l => l.LessonId == lessonId)
                .AnyAsync(l => l.Classroom.ClassroomStudents
                    .Any(cs => cs.StudentId == studentId && cs.DeletedAt == null), ct);
        }

        public async Task<bool> IsTutorOfClassroomAsync(int tutorId, int lessonId, CancellationToken ct = default)
        {
            return await _context.Lessons
                .Include(l => l.Classroom)
                .Where(l => l.LessonId == lessonId)
                .AnyAsync(l => l.Classroom.TutorId == tutorId, ct);
        }
    }
}
