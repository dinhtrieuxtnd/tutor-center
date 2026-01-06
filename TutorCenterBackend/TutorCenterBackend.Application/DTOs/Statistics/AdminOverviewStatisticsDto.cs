namespace TutorCenterBackend.Application.DTOs.Statistics;

public class AdminOverviewStatisticsDto
{
    /// <summary>
    /// Tổng số gia sư
    /// </summary>
    public int TotalTutors { get; set; }

    /// <summary>
    /// Số gia sư đang hoạt động
    /// </summary>
    public int ActiveTutors { get; set; }

    /// <summary>
    /// Số gia sư bị khóa
    /// </summary>
    public int InactiveTutors { get; set; }

    /// <summary>
    /// Tổng số học sinh
    /// </summary>
    public int TotalStudents { get; set; }

    /// <summary>
    /// Số học sinh đang hoạt động
    /// </summary>
    public int ActiveStudents { get; set; }

    /// <summary>
    /// Số học sinh bị khóa
    /// </summary>
    public int InactiveStudents { get; set; }

    /// <summary>
    /// Tổng số lớp học
    /// </summary>
    public int TotalClassrooms { get; set; }

    /// <summary>
    /// Số lớp học đang hoạt động
    /// </summary>
    public int ActiveClassrooms { get; set; }

    /// <summary>
    /// Số lớp học đã lưu trữ
    /// </summary>
    public int ArchivedClassrooms { get; set; }

    /// <summary>
    /// Tổng doanh thu hệ thống
    /// </summary>
    public decimal TotalRevenue { get; set; }

    /// <summary>
    /// Số giao dịch thành công
    /// </summary>
    public int TotalTransactions { get; set; }
}
