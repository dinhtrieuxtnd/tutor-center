using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.Statistics;
using TutorCenterBackend.Application.Interfaces;

namespace TutorCenterBackend.Presentation.Controllers;

/// <summary>
/// Admin statistics controller for system-wide metrics and reports
/// </summary>
[ApiController]
[Route("api/admin/statistics")]
public class AdminStatisticsController : ControllerBase
{
    private readonly IAdminStatisticsService _statisticsService;

    public AdminStatisticsController(IAdminStatisticsService statisticsService)
    {
        _statisticsService = statisticsService;
    }

    /// <summary>
    /// Get overview statistics for the entire system
    /// </summary>
    /// <remarks>
    /// Returns system-wide statistics including:
    /// - Total, active, and inactive tutors
    /// - Total, active, and inactive students
    /// - Total, active, and archived classrooms
    /// - Total system revenue and transaction count
    /// - Average revenue per transaction
    /// 
    /// Sample response:
    /// ```json
    /// {
    ///   "totalTutors": 45,
    ///   "activeTutors": 40,
    ///   "inactiveTutors": 5,
    ///   "totalStudents": 320,
    ///   "activeStudents": 290,
    ///   "inactiveStudents": 30,
    ///   "totalClassrooms": 65,
    ///   "activeClassrooms": 58,
    ///   "archivedClassrooms": 7,
    ///   "totalRevenue": 450000000,
    ///   "totalTransactions": 850,
    ///   "averageRevenuePerTransaction": 529411
    /// }
    /// ```
    /// </remarks>
    /// <returns>Overview statistics DTO</returns>
    [HttpGet("overview")]
    public async Task<ActionResult<AdminOverviewStatisticsDto>> GetOverviewStatistics(CancellationToken ct)
    {
        var statistics = await _statisticsService.GetOverviewStatisticsAsync(ct);
        return Ok(statistics);
    }

    /// <summary>
    /// Get top tutors ranked by revenue
    /// </summary>
    /// <remarks>
    /// Returns a ranked list of top performing tutors based on total revenue.
    /// 
    /// Each tutor includes:
    /// - Tutor ID, name, and email
    /// - Total number of classrooms
    /// - Total number of unique students across all classrooms
    /// - Total revenue generated from all classrooms
    /// 
    /// Sample response:
    /// ```json
    /// [
    ///   {
    ///     "tutorId": 5,
    ///     "tutorName": "Nguyen Van A",
    ///     "email": "tutor.a@example.com",
    ///     "classroomCount": 8,
    ///     "studentCount": 65,
    ///     "totalRevenue": 45000000
    ///   },
    ///   {
    ///     "tutorId": 12,
    ///     "tutorName": "Tran Thi B",
    ///     "email": "tutor.b@example.com",
    ///     "classroomCount": 6,
    ///     "studentCount": 48,
    ///     "totalRevenue": 38500000
    ///   }
    /// ]
    /// ```
    /// </remarks>
    /// <param name="limit">Maximum number of tutors to return (default: 10)</param>
    /// <returns>List of top tutor DTOs ordered by revenue descending</returns>
    [HttpGet("top-tutors")]
    public async Task<ActionResult<List<TopTutorDto>>> GetTopTutors(
        [FromQuery] int limit = 10,
        CancellationToken ct = default)
    {
        if (limit <= 0 || limit > 100)
        {
            return BadRequest("Limit must be between 1 and 100");
        }

        var topTutors = await _statisticsService.GetTopTutorsAsync(limit, ct);
        return Ok(topTutors);
    }

    /// <summary>
    /// Get growth time series data showing new users and classrooms over time
    /// </summary>
    /// <remarks>
    /// Returns daily statistics showing:
    /// - Number of new tutors registered each day
    /// - Number of new students registered each day
    /// - Number of new classrooms created each day
    /// 
    /// Useful for visualizing platform growth trends with line charts or area charts.
    /// Missing dates will have zero values for all metrics.
    /// 
    /// Sample response:
    /// ```json
    /// [
    ///   {
    ///     "date": "2024-01-15T00:00:00",
    ///     "newTutors": 2,
    ///     "newStudents": 8,
    ///     "newClassrooms": 3
    ///   },
    ///   {
    ///     "date": "2024-01-16T00:00:00",
    ///     "newTutors": 1,
    ///     "newStudents": 5,
    ///     "newClassrooms": 2
    ///   }
    /// ]
    /// ```
    /// </remarks>
    /// <param name="query">Query parameters with StartDate and EndDate</param>
    /// <returns>List of growth time series DTOs ordered by date</returns>
    [HttpGet("growth-time-series")]
    public async Task<ActionResult<List<GrowthTimeSeriesDto>>> GetGrowthTimeSeries(
        [FromQuery] GetStatisticsQueryDto query,
        CancellationToken ct = default)
    {
        if (query.StartDate.HasValue && query.EndDate.HasValue && query.StartDate > query.EndDate)
        {
            return BadRequest("Start date must be before or equal to end date");
        }

        if (query.StartDate.HasValue && query.EndDate.HasValue && (query.EndDate.Value - query.StartDate.Value).TotalDays > 365)
        {
            return BadRequest("Date range cannot exceed 365 days");
        }

        var growthData = await _statisticsService.GetGrowthTimeSeriesAsync(query, ct);
        return Ok(growthData);
    }

    /// <summary>
    /// Get system-wide revenue time series data
    /// </summary>
    /// <remarks>
    /// Returns daily revenue statistics for the entire system:
    /// - Total revenue collected each day
    /// - Number of transactions completed each day
    /// - Number of unique students who made payments each day
    /// 
    /// Only includes transactions with "paid" status.
    /// Missing dates will have zero values for all metrics.
    /// 
    /// Sample response:
    /// ```json
    /// [
    ///   {
    ///     "date": "2024-01-15T00:00:00",
    ///     "revenue": 15000000,
    ///     "transactionCount": 28,
    ///     "studentCount": 25
    ///   },
    ///   {
    ///     "date": "2024-01-16T00:00:00",
    ///     "revenue": 18500000,
    ///     "transactionCount": 35,
    ///     "studentCount": 32
    ///   }
    /// ]
    /// ```
    /// </remarks>
    /// <param name="query">Query parameters with StartDate and EndDate</param>
    /// <returns>List of revenue time series DTOs ordered by date</returns>
    [HttpGet("revenue-time-series")]
    public async Task<ActionResult<List<RevenueTimeSeriesDto>>> GetSystemRevenueTimeSeries(
        [FromQuery] GetStatisticsQueryDto query,
        CancellationToken ct = default)
    {
        if (query.StartDate.HasValue && query.EndDate.HasValue && query.StartDate > query.EndDate)
        {
            return BadRequest("Start date must be before or equal to end date");
        }

        if (query.StartDate.HasValue && query.EndDate.HasValue && (query.EndDate.Value - query.StartDate.Value).TotalDays > 365)
        {
            return BadRequest("Date range cannot exceed 365 days");
        }

        var revenueData = await _statisticsService.GetSystemRevenueTimeSeriesAsync(query, ct);
        return Ok(revenueData);
    }
}
