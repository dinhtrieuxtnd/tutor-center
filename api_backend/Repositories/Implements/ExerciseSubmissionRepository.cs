using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements
{
    public class ExerciseSubmissionRepository : BaseRepository<ExerciseSubmission>, IExerciseSubmissionRepository
    {
        private readonly new AppDbContext _db;
        public ExerciseSubmissionRepository(AppDbContext db) : base(db) { _db = db; }

        public Task<ExerciseSubmission?> GetByIdAsync(int submissionId, CancellationToken ct)
            => _db.ExerciseSubmissions.AsNoTracking().FirstOrDefaultAsync(x => x.SubmissionId == submissionId, ct);

        public Task<ExerciseSubmission?> GetByExerciseAndStudentAsync(int exerciseId, int studentId, CancellationToken ct)
            => _db.ExerciseSubmissions.AsNoTracking().FirstOrDefaultAsync(x => x.ExerciseId == exerciseId && x.StudentId == studentId, ct);

        public Task<List<ExerciseSubmission>> ListByExerciseAsync(int exerciseId, CancellationToken ct)
            => _db.ExerciseSubmissions.AsNoTracking()
                .Where(x => x.ExerciseId == exerciseId)
                .OrderByDescending(x => x.SubmittedAt)
                .ToListAsync(ct);
    }
}
