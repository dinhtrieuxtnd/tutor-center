using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class LessonRepository(AppDbContext context) : ILessonRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<Lesson?> GetByIdAsync(int lessonId, CancellationToken ct = default)
        {
            return await _context.Lessons
                .Include(l => l.Lecture)
                    .ThenInclude(lec => lec!.Media)
                .Include(l => l.Lecture)
                    .ThenInclude(lec => lec!.InverseParent)
                        .ThenInclude(child => child.Media)
                .Include(l => l.Lecture)
                    .ThenInclude(lec => lec!.InverseParent)
                        .ThenInclude(child => child.InverseParent)
                            .ThenInclude(grandchild => grandchild.Media)
                .Include(l => l.Exercise)
                    .ThenInclude(ex => ex!.AttachMedia)
                .Include(l => l.Quiz)
                .FirstOrDefaultAsync(l => l.LessonId == lessonId && l.DeletedAt == null, ct);
        }

        public async Task<Lesson?> GetByIdWithQuizAsync(int lessonId, CancellationToken ct = default)
        {
            return await _context.Lessons
                .Include(l => l.Quiz)
                .Include(l => l.Classroom)
                    .ThenInclude(c => c.ClassroomStudents)
                .FirstOrDefaultAsync(l => l.LessonId == lessonId && l.DeletedAt == null, ct);
        }

        public async Task<Lesson?> GetByIdWithQuizDetailAsync(int lessonId, CancellationToken ct = default)
        {
            return await _context.Lessons
                .Include(l => l.Quiz)
                    .ThenInclude(q => q!.QuizSections.OrderBy(s => s.OrderIndex))
                        .ThenInclude(s => s.QuestionGroups.OrderBy(g => g.OrderIndex))
                            .ThenInclude(g => g.Questions.OrderBy(q => q.OrderIndex))
                                .ThenInclude(q => q.QuestionOptions.OrderBy(o => o.OrderIndex))
                .Include(l => l.Quiz)
                    .ThenInclude(q => q!.QuizSections)
                        .ThenInclude(s => s.Questions.Where(q => q.GroupId == null).OrderBy(q => q.OrderIndex))
                            .ThenInclude(q => q.QuestionOptions.OrderBy(o => o.OrderIndex))
                .Include(l => l.Quiz)
                    .ThenInclude(q => q!.QuestionGroups.Where(g => g.SectionId == null).OrderBy(g => g.OrderIndex))
                        .ThenInclude(g => g.Questions.OrderBy(q => q.OrderIndex))
                            .ThenInclude(q => q.QuestionOptions.OrderBy(o => o.OrderIndex))
                .Include(l => l.Quiz)
                    .ThenInclude(q => q!.Questions.Where(q => q.SectionId == null && q.GroupId == null).OrderBy(q => q.OrderIndex))
                        .ThenInclude(q => q.QuestionOptions.OrderBy(o => o.OrderIndex))
                .Include(l => l.Classroom)
                    .ThenInclude(c => c.ClassroomStudents)
                .FirstOrDefaultAsync(l => l.LessonId == lessonId && l.DeletedAt == null, ct);
        }

        public async Task AddAsync(Lesson lesson, CancellationToken ct = default)
        {
            await _context.Lessons.AddAsync(lesson, ct);
            await _context.SaveChangesAsync(ct);
        }

        public async Task UpdateAsync(Lesson lesson, CancellationToken ct = default)
        {
            _context.Lessons.Update(lesson);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<List<Lesson>> GetLessonsByClassroomIdAsync(int classroomId, CancellationToken ct = default)
        {
            return await _context.Lessons
                .Include(l => l.Lecture)
                    .ThenInclude(lec => lec!.Media)
                .Include(l => l.Lecture)
                    .ThenInclude(lec => lec!.InverseParent)
                        .ThenInclude(child => child.Media)
                .Include(l => l.Lecture)
                    .ThenInclude(lec => lec!.InverseParent)
                        .ThenInclude(child => child.InverseParent)
                            .ThenInclude(grandchild => grandchild.Media)
                .Include(l => l.Exercise)
                    .ThenInclude(ex => ex!.AttachMedia)
                .Include(l => l.Quiz)
                .Where(l => l.ClassroomId == classroomId && l.DeletedAt == null)
                .OrderBy(l => l.OrderIndex)
                .ToListAsync(ct);
        }

        public async Task<bool> ExistsAsync(int classroomId, int? lectureId, int? exerciseId, int? quizId, CancellationToken ct = default)
        {
            return await _context.Lessons
                .AnyAsync(l => 
                    l.ClassroomId == classroomId && 
                    l.LectureId == lectureId && 
                    l.ExerciseId == exerciseId && 
                    l.QuizId == quizId && 
                    l.DeletedAt == null, ct);
        }
    }
}
