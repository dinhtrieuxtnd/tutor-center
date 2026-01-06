using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for statistics queries
/// Returns primitive types and value tuples (no DTOs) following Clean Architecture
/// </summary>
public class StatisticsRepository : IStatisticsRepository
{
    private readonly AppDbContext _context;

    public StatisticsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<int>> GetTutorClassroomIdsAsync(int tutorId, CancellationToken ct = default)
    {
        return await _context.Classrooms
            .Where(c => c.TutorId == tutorId && c.DeletedAt == null)
            .Select(c => c.ClassroomId)
            .ToListAsync(ct);
    }

    public async Task<int> CountTotalStudentsByTutorAsync(int tutorId, CancellationToken ct = default)
    {
        var classroomIds = await GetTutorClassroomIdsAsync(tutorId, ct);

        return await _context.ClassroomStudents
            .Where(cs => classroomIds.Contains(cs.ClassroomId) && cs.DeletedAt == null)
            .Select(cs => cs.StudentId)
            .Distinct()
            .CountAsync(ct);
    }

    public async Task<int> CountPaidStudentsByTutorAsync(int tutorId, CancellationToken ct = default)
    {
        var classroomIds = await GetTutorClassroomIdsAsync(tutorId, ct);

        return await _context.ClassroomStudents
            .Where(cs => classroomIds.Contains(cs.ClassroomId) 
                && cs.DeletedAt == null 
                && cs.HasPaid)
            .CountAsync(ct);
    }

    public async Task<int> CountLecturesByTutorAsync(int tutorId, CancellationToken ct = default)
    {
        return await _context.Lectures
            .Where(l => l.UploadedBy == tutorId && l.DeletedAt == null)
            .CountAsync(ct);
    }

    public async Task<int> CountExercisesByTutorAsync(int tutorId, CancellationToken ct = default)
    {
        return await _context.Exercises
            .Where(e => e.CreatedBy == tutorId && e.DeletedAt == null)
            .CountAsync(ct);
    }

    public async Task<int> CountQuizzesByTutorAsync(int tutorId, CancellationToken ct = default)
    {
        return await _context.Quizzes
            .Where(q => q.CreatedBy == tutorId && q.DeletedAt == null)
            .CountAsync(ct);
    }

    public async Task<int> CountPendingSubmissionsByTutorAsync(int tutorId, CancellationToken ct = default)
    {
        var exerciseIds = await _context.Exercises
            .Where(e => e.CreatedBy == tutorId && e.DeletedAt == null)
            .Select(e => e.ExerciseId)
            .ToListAsync(ct);

        return await _context.ExerciseSubmissions
            .Where(es => exerciseIds.Contains(es.ExerciseId) && es.GradedAt == null)
            .CountAsync(ct);
    }

    public async Task<int> CountPendingJoinRequestsByTutorAsync(int tutorId, CancellationToken ct = default)
    {
        var classroomIds = await GetTutorClassroomIdsAsync(tutorId, ct);

        return await _context.JoinRequests
            .Where(jr => classroomIds.Contains(jr.ClassroomId) && jr.Status == "pending")
            .CountAsync(ct);
    }

    public async Task<decimal> CalculateTotalRevenueByTutorAsync(int tutorId, CancellationToken ct = default)
    {
        var classroomIds = await GetTutorClassroomIdsAsync(tutorId, ct);

        return await _context.PaymentTransactions
            .Where(pt => classroomIds.Contains(pt.ClassroomId) && pt.Status == "paid")
            .SumAsync(pt => (decimal?)pt.Amount, ct) ?? 0;
    }

    public async Task<List<(int ClassroomId, string ClassName, int StudentCount, decimal Revenue, int LectureCount, int ExerciseCount, int QuizCount, int PendingSubmissions)>> 
        GetClassroomStatisticsByTutorAsync(int tutorId, CancellationToken ct = default)
    {
        var classrooms = await _context.Classrooms
            .Where(c => c.TutorId == tutorId && c.DeletedAt == null)
            .Select(c => new
            {
                c.ClassroomId,
                c.Name
            })
            .ToListAsync(ct);

        var result = new List<(int, string, int, decimal, int, int, int, int)>();

        foreach (var classroom in classrooms)
        {
            var studentCount = await _context.ClassroomStudents
                .Where(cs => cs.ClassroomId == classroom.ClassroomId && cs.DeletedAt == null)
                .CountAsync(ct);

            var revenue = await _context.PaymentTransactions
                .Where(pt => pt.ClassroomId == classroom.ClassroomId && pt.Status == "paid")
                .SumAsync(pt => (decimal?)pt.Amount, ct) ?? 0;

            var lectureCount = await _context.Lessons
                .Where(l => l.ClassroomId == classroom.ClassroomId 
                    && l.DeletedAt == null 
                    && l.LessonType == "lecture")
                .CountAsync(ct);

            var exerciseCount = await _context.Lessons
                .Where(l => l.ClassroomId == classroom.ClassroomId 
                    && l.DeletedAt == null 
                    && l.LessonType == "exercise")
                .CountAsync(ct);

            var quizCount = await _context.Lessons
                .Where(l => l.ClassroomId == classroom.ClassroomId 
                    && l.DeletedAt == null 
                    && l.LessonType == "quiz")
                .CountAsync(ct);

            var lessonIds = await _context.Lessons
                .Where(l => l.ClassroomId == classroom.ClassroomId && l.DeletedAt == null)
                .Select(l => l.LessonId)
                .ToListAsync(ct);

            var pendingSubmissions = await _context.ExerciseSubmissions
                .Where(es => lessonIds.Contains(es.LessonId) && es.GradedAt == null)
                .CountAsync(ct);

            result.Add((
                classroom.ClassroomId,
                classroom.Name,
                studentCount,
                revenue,
                lectureCount,
                exerciseCount,
                quizCount,
                pendingSubmissions
            ));
        }

        return result.OrderByDescending(x => x.Item4).ToList();
    }

    public async Task<List<(DateTime Date, decimal Revenue, int TransactionCount, int StudentCount)>> 
        GetRevenueTimeSeriesAsync(
            int tutorId, 
            DateTime startDate, 
            DateTime endDate, 
            int? classroomId = null, 
            CancellationToken ct = default)
    {
        var classroomQuery = _context.Classrooms
            .Where(c => c.TutorId == tutorId && c.DeletedAt == null);

        if (classroomId.HasValue)
        {
            classroomQuery = classroomQuery.Where(c => c.ClassroomId == classroomId.Value);
        }

        var classroomIds = await classroomQuery
            .Select(c => c.ClassroomId)
            .ToListAsync(ct);

        var transactions = await _context.PaymentTransactions
            .Where(pt => classroomIds.Contains(pt.ClassroomId)
                && pt.Status == "paid"
                && pt.PaidAt != null
                && pt.PaidAt >= startDate
                && pt.PaidAt <= endDate)
            .GroupBy(pt => pt.PaidAt!.Value.Date)
            .Select(g => new
            {
                Date = g.Key,
                Revenue = g.Sum(pt => pt.Amount),
                TransactionCount = g.Count(),
                StudentCount = g.Select(pt => pt.StudentId).Distinct().Count()
            })
            .ToListAsync(ct);

        // Fill missing dates with zero values
        var result = new List<(DateTime, decimal, int, int)>();
        var currentDate = startDate.Date;

        while (currentDate <= endDate.Date)
        {
            var existing = transactions.FirstOrDefault(t => t.Date == currentDate);
            
            if (existing != null)
            {
                result.Add((currentDate, existing.Revenue, existing.TransactionCount, existing.StudentCount));
            }
            else
            {
                result.Add((currentDate, 0, 0, 0));
            }

            currentDate = currentDate.AddDays(1);
        }

        return result;
    }

    public async Task<List<(DateTime Date, int SubmissionCount, int GradedCount, int PendingCount)>> 
        GetSubmissionTimeSeriesAsync(
            int tutorId, 
            DateTime startDate, 
            DateTime endDate, 
            int? classroomId = null, 
            CancellationToken ct = default)
    {
        // Get exercises by tutor
        var exerciseQuery = _context.Exercises
            .Where(e => e.CreatedBy == tutorId && e.DeletedAt == null);

        var exerciseIds = await exerciseQuery
            .Select(e => e.ExerciseId)
            .ToListAsync(ct);

        // If classroomId is specified, filter by classroom lessons
        if (classroomId.HasValue)
        {
            var lessonExerciseIds = await _context.Lessons
                .Where(l => l.ClassroomId == classroomId.Value 
                    && l.DeletedAt == null 
                    && l.ExerciseId != null)
                .Select(l => l.ExerciseId!.Value)
                .ToListAsync(ct);

            exerciseIds = exerciseIds.Intersect(lessonExerciseIds).ToList();
        }

        var submissions = await _context.ExerciseSubmissions
            .Where(es => exerciseIds.Contains(es.ExerciseId)
                && es.SubmittedAt >= startDate
                && es.SubmittedAt <= endDate)
            .GroupBy(es => es.SubmittedAt.Date)
            .Select(g => new
            {
                Date = g.Key,
                SubmissionCount = g.Count(),
                GradedCount = g.Count(es => es.GradedAt != null),
                PendingCount = g.Count(es => es.GradedAt == null)
            })
            .ToListAsync(ct);

        // Fill missing dates with zero values
        var result = new List<(DateTime, int, int, int)>();
        var currentDate = startDate.Date;

        while (currentDate <= endDate.Date)
        {
            var existing = submissions.FirstOrDefault(s => s.Date == currentDate);
            
            if (existing != null)
            {
                result.Add((currentDate, existing.SubmissionCount, existing.GradedCount, existing.PendingCount));
            }
            else
            {
                result.Add((currentDate, 0, 0, 0));
            }

            currentDate = currentDate.AddDays(1);
        }

        return result;
    }

    public async Task<List<(int StudentId, string StudentName, string StudentEmail, int LecturesCompleted, int TotalLectures, int ExercisesSubmitted, int TotalExercises, int QuizzesAttempted, int TotalQuizzes, decimal? AverageScore)>> 
        GetStudentPerformanceByClassroomAsync(int classroomId, CancellationToken ct = default)
    {
        var students = await _context.ClassroomStudents
            .Where(cs => cs.ClassroomId == classroomId && cs.DeletedAt == null)
            .Select(cs => new
            {
                cs.StudentId,
                cs.Student.FullName,
                cs.Student.Email
            })
            .ToListAsync(ct);

        // Get all lessons in classroom
        var totalLectures = await _context.Lessons
            .Where(l => l.ClassroomId == classroomId 
                && l.DeletedAt == null 
                && l.LessonType == "lecture")
            .CountAsync(ct);

        var totalExercises = await _context.Lessons
            .Where(l => l.ClassroomId == classroomId 
                && l.DeletedAt == null 
                && l.LessonType == "exercise")
            .CountAsync(ct);

        var totalQuizzes = await _context.Lessons
            .Where(l => l.ClassroomId == classroomId 
                && l.DeletedAt == null 
                && l.LessonType == "quiz")
            .CountAsync(ct);

        // Get lesson IDs for queries
        var exerciseLessonIds = await _context.Lessons
            .Where(l => l.ClassroomId == classroomId 
                && l.DeletedAt == null 
                && l.LessonType == "exercise"
                && l.ExerciseId != null)
            .Select(l => l.LessonId)
            .ToListAsync(ct);

        var quizLessonIds = await _context.Lessons
            .Where(l => l.ClassroomId == classroomId 
                && l.DeletedAt == null 
                && l.LessonType == "quiz"
                && l.QuizId != null)
            .Select(l => l.LessonId)
            .ToListAsync(ct);

        var result = new List<(int, string, string, int, int, int, int, int, int, decimal?)>();

        foreach (var student in students)
        {
            // Count exercises submitted by student (for this classroom)
            var exercisesSubmitted = await _context.ExerciseSubmissions
                .Where(es => es.StudentId == student.StudentId 
                    && exerciseLessonIds.Contains(es.LessonId))
                .Select(es => es.LessonId)
                .Distinct()
                .CountAsync(ct);

            // Count quizzes attempted by student
            var quizAttempts = await _context.QuizAttempts
                .Where(qa => qa.StudentId == student.StudentId 
                    && quizLessonIds.Contains(qa.LessonId))
                .Select(qa => qa.LessonId)
                .Distinct()
                .CountAsync(ct);

            // Calculate average quiz score (using ScoreScaled10)
            var averageScore = await _context.QuizAttempts
                .Where(qa => qa.StudentId == student.StudentId 
                    && quizLessonIds.Contains(qa.LessonId)
                    && qa.ScoreScaled10 != null)
                .AverageAsync(qa => (decimal?)qa.ScoreScaled10, ct);

            result.Add((
                student.StudentId,
                student.FullName,
                student.Email,
                0, // LecturesCompleted - not tracked in current schema
                totalLectures,
                exercisesSubmitted,
                totalExercises,
                quizAttempts,
                totalQuizzes,
                averageScore
            ));
        }

        return result.OrderByDescending(x => x.Item10 ?? 0).ToList();
    }
}
