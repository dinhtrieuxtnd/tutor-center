using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for admin statistics queries
/// Returns primitive types and value tuples (no DTOs) following Clean Architecture
/// </summary>
public class AdminStatisticsRepository : IAdminStatisticsRepository
{
    private readonly AppDbContext _context;

    public AdminStatisticsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int> CountTotalTutorsAsync(CancellationToken ct = default)
    {
        return await _context.Users
            .Where(u => u.RoleId == 2) // Tutor role
            .CountAsync(ct);
    }

    public async Task<int> CountActiveTutorsAsync(CancellationToken ct = default)
    {
        return await _context.Users
            .Where(u => u.RoleId == 2 && u.IsActive)
            .CountAsync(ct);
    }

    public async Task<int> CountTotalStudentsAsync(CancellationToken ct = default)
    {
        return await _context.Users
            .Where(u => u.RoleId == 3) // Student role
            .CountAsync(ct);
    }

    public async Task<int> CountActiveStudentsAsync(CancellationToken ct = default)
    {
        return await _context.Users
            .Where(u => u.RoleId == 3 && u.IsActive)
            .CountAsync(ct);
    }

    public async Task<int> CountTotalClassroomsAsync(CancellationToken ct = default)
    {
        return await _context.Classrooms
            .Where(c => c.DeletedAt == null)
            .CountAsync(ct);
    }

    public async Task<int> CountActiveClassroomsAsync(CancellationToken ct = default)
    {
        return await _context.Classrooms
            .Where(c => c.DeletedAt == null && !c.IsArchived)
            .CountAsync(ct);
    }

    public async Task<int> CountArchivedClassroomsAsync(CancellationToken ct = default)
    {
        return await _context.Classrooms
            .Where(c => c.DeletedAt == null && c.IsArchived)
            .CountAsync(ct);
    }

    public async Task<decimal> CalculateTotalSystemRevenueAsync(CancellationToken ct = default)
    {
        return await _context.PaymentTransactions
            .Where(pt => pt.Status == "paid")
            .SumAsync(pt => (decimal?)pt.Amount, ct) ?? 0;
    }

    public async Task<int> CountTotalTransactionsAsync(CancellationToken ct = default)
    {
        return await _context.PaymentTransactions
            .Where(pt => pt.Status == "paid")
            .CountAsync(ct);
    }

    public async Task<List<(int TutorId, string Name, string Email, int ClassroomCount, int StudentCount, decimal Revenue)>>
        GetTopTutorsAsync(int limit, CancellationToken ct = default)
    {
        var tutors = await _context.Users
            .Where(u => u.RoleId == 2 && u.IsActive)
            .Select(u => new
            {
                u.UserId,
                u.FullName,
                u.Email
            })
            .ToListAsync(ct);

        var result = new List<(int, string, string, int, int, decimal)>();

        foreach (var tutor in tutors)
        {
            var classroomCount = await _context.Classrooms
                .Where(c => c.TutorId == tutor.UserId && c.DeletedAt == null)
                .CountAsync(ct);

            var classroomIds = await _context.Classrooms
                .Where(c => c.TutorId == tutor.UserId && c.DeletedAt == null)
                .Select(c => c.ClassroomId)
                .ToListAsync(ct);

            var studentCount = await _context.ClassroomStudents
                .Where(cs => classroomIds.Contains(cs.ClassroomId) && cs.DeletedAt == null)
                .Select(cs => cs.StudentId)
                .Distinct()
                .CountAsync(ct);

            var revenue = await _context.PaymentTransactions
                .Where(pt => classroomIds.Contains(pt.ClassroomId) && pt.Status == "paid")
                .SumAsync(pt => (decimal?)pt.Amount, ct) ?? 0;

            result.Add((tutor.UserId, tutor.FullName, tutor.Email, classroomCount, studentCount, revenue));
        }

        return result
            .OrderByDescending(x => x.Item6) // Order by Revenue
            .Take(limit)
            .ToList();
    }

    public async Task<List<(DateTime Date, int NewTutors, int NewStudents, int NewClassrooms)>>
        GetGrowthTimeSeriesAsync(DateTime startDate, DateTime endDate, CancellationToken ct = default)
    {
        // Get new tutors by date
        var newTutors = await _context.Users
            .Where(u => u.RoleId == 2 
                && u.CreatedAt >= startDate 
                && u.CreatedAt <= endDate)
            .GroupBy(u => u.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        // Get new students by date
        var newStudents = await _context.Users
            .Where(u => u.RoleId == 3 
                && u.CreatedAt >= startDate 
                && u.CreatedAt <= endDate)
            .GroupBy(u => u.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        // Get new classrooms by date
        var newClassrooms = await _context.Classrooms
            .Where(c => c.CreatedAt >= startDate 
                && c.CreatedAt <= endDate)
            .GroupBy(c => c.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        // Fill missing dates with zero values
        var result = new List<(DateTime, int, int, int)>();
        var currentDate = startDate.Date;

        while (currentDate <= endDate.Date)
        {
            var tutorCount = newTutors.FirstOrDefault(t => t.Date == currentDate)?.Count ?? 0;
            var studentCount = newStudents.FirstOrDefault(s => s.Date == currentDate)?.Count ?? 0;
            var classroomCount = newClassrooms.FirstOrDefault(c => c.Date == currentDate)?.Count ?? 0;

            result.Add((currentDate, tutorCount, studentCount, classroomCount));
            currentDate = currentDate.AddDays(1);
        }

        return result;
    }

    public async Task<List<(DateTime Date, decimal Revenue, int TransactionCount, int StudentCount)>>
        GetSystemRevenueTimeSeriesAsync(DateTime startDate, DateTime endDate, CancellationToken ct = default)
    {
        var transactions = await _context.PaymentTransactions
            .Where(pt => pt.Status == "paid"
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
}
