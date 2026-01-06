namespace TutorCenterBackend.Application.DTOs.Statistics;

/// <summary>
/// DTO cho biểu đồ đường doanh thu theo thời gian
/// </summary>
public class RevenueTimeSeriesDto
{
    /// <summary>
    /// Ngày (format: yyyy-MM-dd)
    /// </summary>
    public string Date { get; set; } = null!;

    /// <summary>
    /// Doanh thu trong ngày
    /// </summary>
    public decimal Revenue { get; set; }

    /// <summary>
    /// Số giao dịch thành công
    /// </summary>
    public int TransactionCount { get; set; }

    /// <summary>
    /// Số học sinh thanh toán
    /// </summary>
    public int StudentCount { get; set; }
}
