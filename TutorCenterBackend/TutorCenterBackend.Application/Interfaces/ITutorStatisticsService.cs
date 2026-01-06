using TutorCenterBackend.Application.DTOs.Statistics;

namespace TutorCenterBackend.Application.Interfaces;

/// <summary>
/// Service quản lý thống kê cho Tutor
/// </summary>
public interface ITutorStatisticsService
{
    /// <summary>
    /// Lấy thống kê tổng quan của tutor
    /// </summary>
    Task<TutorOverviewStatisticsDto> GetOverviewStatisticsAsync(CancellationToken ct = default);

    /// <summary>
    /// Lấy thống kê chi tiết theo từng lớp học
    /// </summary>
    Task<List<ClassroomStatisticsDto>> GetClassroomStatisticsAsync(CancellationToken ct = default);

    /// <summary>
    /// Lấy dữ liệu doanh thu theo thời gian (cho biểu đồ đường)
    /// </summary>
    Task<List<RevenueTimeSeriesDto>> GetRevenueTimeSeriesAsync(GetStatisticsQueryDto query, CancellationToken ct = default);

    /// <summary>
    /// Lấy dữ liệu bài nộp theo thời gian (cho biểu đồ đường)
    /// </summary>
    Task<List<SubmissionTimeSeriesDto>> GetSubmissionTimeSeriesAsync(GetStatisticsQueryDto query, CancellationToken ct = default);

    /// <summary>
    /// Lấy thống kê hiệu suất học sinh trong 1 lớp
    /// </summary>
    Task<List<StudentPerformanceDto>> GetStudentPerformanceAsync(int classroomId, CancellationToken ct = default);
}
