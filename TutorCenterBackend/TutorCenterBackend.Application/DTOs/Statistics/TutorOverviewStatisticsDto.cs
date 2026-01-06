namespace TutorCenterBackend.Application.DTOs.Statistics;

public class TutorOverviewStatisticsDto
{
    /// <summary>
    /// Tổng số lớp học đang giảng dạy
    /// </summary>
    public int TotalClassrooms { get; set; }

    /// <summary>
    /// Tổng số học sinh
    /// </summary>
    public int TotalStudents { get; set; }

    /// <summary>
    /// Tổng số bài giảng
    /// </summary>
    public int TotalLectures { get; set; }

    /// <summary>
    /// Tổng số bài tập
    /// </summary>
    public int TotalExercises { get; set; }

    /// <summary>
    /// Tổng số bài kiểm tra
    /// </summary>
    public int TotalQuizzes { get; set; }

    /// <summary>
    /// Số bài nộp chưa chấm
    /// </summary>
    public int PendingSubmissions { get; set; }

    /// <summary>
    /// Số yêu cầu tham gia chờ duyệt
    /// </summary>
    public int PendingJoinRequests { get; set; }

    /// <summary>
    /// Tổng doanh thu
    /// </summary>
    public decimal TotalRevenue { get; set; }

    /// <summary>
    /// Số học sinh đã thanh toán
    /// </summary>
    public int PaidStudents { get; set; }

    /// <summary>
    /// Số học sinh chưa thanh toán
    /// </summary>
    public int UnpaidStudents { get; set; }
}
