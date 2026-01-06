namespace TutorCenterBackend.Application.DTOs.Statistics;

/// <summary>
/// DTO cho biểu đồ đường số bài nộp theo thời gian
/// </summary>
public class SubmissionTimeSeriesDto
{
    /// <summary>
    /// Ngày (format: yyyy-MM-dd)
    /// </summary>
    public string Date { get; set; } = null!;

    /// <summary>
    /// Số bài nộp trong ngày
    /// </summary>
    public int SubmissionCount { get; set; }

    /// <summary>
    /// Số bài đã chấm
    /// </summary>
    public int GradedCount { get; set; }

    /// <summary>
    /// Số bài chưa chấm
    /// </summary>
    public int PendingCount { get; set; }
}
