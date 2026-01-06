using TutorCenterBackend.Application.DTOs.Statistics;

namespace TutorCenterBackend.Application.Interfaces;

public interface IAdminStatisticsService
{
    /// <summary>
    /// Lấy thống kê tổng quan của hệ thống
    /// </summary>
    Task<AdminOverviewStatisticsDto> GetOverviewStatisticsAsync(CancellationToken ct = default);

    /// <summary>
    /// Lấy danh sách top gia sư theo doanh thu
    /// </summary>
    Task<List<TopTutorDto>> GetTopTutorsAsync(int limit = 10, CancellationToken ct = default);

    /// <summary>
    /// Lấy dữ liệu tăng trưởng theo thời gian
    /// </summary>
    Task<List<GrowthTimeSeriesDto>> GetGrowthTimeSeriesAsync(
        GetStatisticsQueryDto query,
        CancellationToken ct = default);

    /// <summary>
    /// Lấy thống kê doanh thu theo thời gian (toàn hệ thống)
    /// </summary>
    Task<List<RevenueTimeSeriesDto>> GetSystemRevenueTimeSeriesAsync(
        GetStatisticsQueryDto query,
        CancellationToken ct = default);
}
