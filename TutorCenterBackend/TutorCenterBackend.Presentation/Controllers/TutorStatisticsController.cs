using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.Statistics;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers;

/// <summary>
/// API thống kê dành cho Tutor
/// </summary>
[ApiController]
[Route("api/tutor/statistics")]
[Authorize]
public class TutorStatisticsController : ControllerBase
{
    private readonly ITutorStatisticsService _statisticsService;

    public TutorStatisticsController(ITutorStatisticsService statisticsService)
    {
        _statisticsService = statisticsService;
    }

    /// <summary>
    /// Lấy thống kê tổng quan của tutor
    /// </summary>
    /// <remarks>
    /// Trả về:
    /// - Tổng số lớp học, học sinh, bài giảng, bài tập, quiz
    /// - Số bài nộp chưa chấm, yêu cầu tham gia chờ duyệt
    /// - Tổng doanh thu, số học sinh đã/chưa thanh toán
    /// </remarks>
    /// <returns>Dữ liệu thống kê tổng quan</returns>
    [HttpGet("overview")]
    public async Task<ActionResult<TutorOverviewStatisticsDto>> GetOverviewStatistics(CancellationToken ct = default)
    {
        var result = await _statisticsService.GetOverviewStatisticsAsync(ct);
        return Ok(result);
    }

    /// <summary>
    /// Lấy thống kê chi tiết theo từng lớp học
    /// </summary>
    /// <remarks>
    /// Trả về danh sách các lớp học với thống kê:
    /// - Số học sinh (tổng/đã thanh toán/chưa thanh toán)
    /// - Doanh thu từ lớp học
    /// - Tổng số bài học
    /// - Số bài nộp chưa chấm
    /// 
    /// Danh sách được sắp xếp theo doanh thu giảm dần
    /// </remarks>
    /// <returns>Danh sách thống kê theo lớp học</returns>
    [HttpGet("classrooms")]
    public async Task<ActionResult<List<ClassroomStatisticsDto>>> GetClassroomStatistics(CancellationToken ct = default)
    {
        var result = await _statisticsService.GetClassroomStatisticsAsync(ct);
        return Ok(result);
    }

    /// <summary>
    /// Lấy dữ liệu doanh thu theo thời gian (dùng để vẽ biểu đồ đường)
    /// </summary>
    /// <remarks>
    /// Trả về dữ liệu time series doanh thu theo ngày:
    /// - Date: Ngày (yyyy-MM-dd)
    /// - Revenue: Doanh thu trong ngày
    /// - TransactionCount: Số giao dịch thành công
    /// - StudentCount: Số học sinh thanh toán
    /// 
    /// Mặc định lấy 30 ngày gần nhất nếu không truyền startDate/endDate
    /// Có thể filter theo ClassroomId
    /// 
    /// Các ngày không có giao dịch sẽ có giá trị 0
    /// </remarks>
    /// <param name="query">Query parameters (StartDate, EndDate, ClassroomId)</param>
    /// <returns>Dữ liệu time series doanh thu</returns>
    [HttpGet("revenue-time-series")]
    public async Task<ActionResult<List<RevenueTimeSeriesDto>>> GetRevenueTimeSeries(
        [FromQuery] GetStatisticsQueryDto query, 
        CancellationToken ct = default)
    {
        var result = await _statisticsService.GetRevenueTimeSeriesAsync(query, ct);
        return Ok(result);
    }

    /// <summary>
    /// Lấy dữ liệu bài nộp theo thời gian (dùng để vẽ biểu đồ đường)
    /// </summary>
    /// <remarks>
    /// Trả về dữ liệu time series bài nộp theo ngày:
    /// - Date: Ngày (yyyy-MM-dd)
    /// - SubmissionCount: Tổng số bài nộp trong ngày
    /// - GradedCount: Số bài đã chấm
    /// - PendingCount: Số bài chưa chấm
    /// 
    /// Mặc định lấy 30 ngày gần nhất nếu không truyền startDate/endDate
    /// Có thể filter theo ClassroomId
    /// 
    /// Các ngày không có bài nộp sẽ có giá trị 0
    /// </remarks>
    /// <param name="query">Query parameters (StartDate, EndDate, ClassroomId)</param>
    /// <returns>Dữ liệu time series bài nộp</returns>
    [HttpGet("submission-time-series")]
    public async Task<ActionResult<List<SubmissionTimeSeriesDto>>> GetSubmissionTimeSeries(
        [FromQuery] GetStatisticsQueryDto query, 
        CancellationToken ct = default)
    {
        var result = await _statisticsService.GetSubmissionTimeSeriesAsync(query, ct);
        return Ok(result);
    }

    /// <summary>
    /// Lấy thống kê hiệu suất học sinh trong 1 lớp
    /// </summary>
    /// <remarks>
    /// Trả về danh sách học sinh với các chỉ số:
    /// - Số bài tập đã nộp / tổng số bài tập
    /// - Số quiz đã làm / tổng số quiz
    /// - Điểm trung bình bài tập
    /// - Điểm trung bình quiz (thang 10)
    /// - Tỷ lệ hoàn thành (%)
    /// 
    /// Danh sách được sắp xếp theo tỷ lệ hoàn thành giảm dần
    /// 
    /// Chỉ Tutor chủ lớp mới có thể xem thống kê
    /// </remarks>
    /// <param name="classroomId">ID lớp học</param>
    /// <returns>Danh sách thống kê hiệu suất học sinh</returns>
    [HttpGet("students/performance/{classroomId}")]
    [ValidateId]
    public async Task<ActionResult<List<StudentPerformanceDto>>> GetStudentPerformance(
        int classroomId, 
        CancellationToken ct = default)
    {
        var result = await _statisticsService.GetStudentPerformanceAsync(classroomId, ct);
        return Ok(result);
    }
}
