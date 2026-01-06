using TutorCenterBackend.Application.DTOs.Statistics;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation;

/// <summary>
/// Service implementation for admin statistics
/// Maps repository value tuples to DTOs
/// </summary>
public class AdminStatisticsService : IAdminStatisticsService
{
    private readonly IAdminStatisticsRepository _repository;

    public AdminStatisticsService(IAdminStatisticsRepository repository)
    {
        _repository = repository;
    }

    public async Task<AdminOverviewStatisticsDto> GetOverviewStatisticsAsync(CancellationToken ct = default)
    {
        // Execute queries sequentially (DbContext is not thread-safe)
        var totalTutors = await _repository.CountTotalTutorsAsync(ct);
        var activeTutors = await _repository.CountActiveTutorsAsync(ct);
        var totalStudents = await _repository.CountTotalStudentsAsync(ct);
        var activeStudents = await _repository.CountActiveStudentsAsync(ct);
        var totalClassrooms = await _repository.CountTotalClassroomsAsync(ct);
        var activeClassrooms = await _repository.CountActiveClassroomsAsync(ct);
        var archivedClassrooms = await _repository.CountArchivedClassroomsAsync(ct);
        var totalRevenue = await _repository.CalculateTotalSystemRevenueAsync(ct);
        var totalTransactions = await _repository.CountTotalTransactionsAsync(ct);

        return new AdminOverviewStatisticsDto
        {
            TotalTutors = totalTutors,
            ActiveTutors = activeTutors,
            InactiveTutors = totalTutors - activeTutors,
            TotalStudents = totalStudents,
            ActiveStudents = activeStudents,
            InactiveStudents = totalStudents - activeStudents,
            TotalClassrooms = totalClassrooms,
            ActiveClassrooms = activeClassrooms,
            ArchivedClassrooms = archivedClassrooms,
            TotalRevenue = totalRevenue,
            TotalTransactions = totalTransactions
        };
    }

    public async Task<List<TopTutorDto>> GetTopTutorsAsync(int limit, CancellationToken ct = default)
    {
        var topTutors = await _repository.GetTopTutorsAsync(limit, ct);

        return topTutors.Select(t => new TopTutorDto
        {
            TutorId = t.TutorId,
            TutorName = t.Name,
            Email = t.Email,
            ClassroomCount = t.ClassroomCount,
            StudentCount = t.StudentCount,
            TotalRevenue = t.Revenue
        }).ToList();
    }

    public async Task<List<GrowthTimeSeriesDto>> GetGrowthTimeSeriesAsync(GetStatisticsQueryDto query, CancellationToken ct = default)
    {
        var startDate = query.StartDate ?? DateTime.Today.AddMonths(-1);
        var endDate = query.EndDate ?? DateTime.Today;
        
        var growthData = await _repository.GetGrowthTimeSeriesAsync(startDate, endDate, ct);

        return growthData.Select(g => new GrowthTimeSeriesDto
        {
            Date = g.Date.ToString("yyyy-MM-dd"),
            NewTutors = g.NewTutors,
            NewStudents = g.NewStudents,
            NewClassrooms = g.NewClassrooms
        }).ToList();
    }

    public async Task<List<RevenueTimeSeriesDto>> GetSystemRevenueTimeSeriesAsync(GetStatisticsQueryDto query, CancellationToken ct = default)
    {
        var startDate = query.StartDate ?? DateTime.Today.AddMonths(-1);
        var endDate = query.EndDate ?? DateTime.Today;
        
        var revenueData = await _repository.GetSystemRevenueTimeSeriesAsync(startDate, endDate, ct);

        return revenueData.Select(r => new RevenueTimeSeriesDto
        {
            Date = r.Date.ToString("yyyy-MM-dd"),
            Revenue = r.Revenue,
            TransactionCount = r.TransactionCount,
            StudentCount = r.StudentCount
        }).ToList();
    }
}
