using System.ComponentModel.DataAnnotations;

namespace TutorCenterBackend.Application.DTOs.Statistics;

public class GetStatisticsQueryDto
{
    /// <summary>
    /// Ngày bắt đầu (optional, format: yyyy-MM-dd)
    /// </summary>
    public DateTime? StartDate { get; set; }

    /// <summary>
    /// Ngày kết thúc (optional, format: yyyy-MM-dd)
    /// </summary>
    public DateTime? EndDate { get; set; }

    /// <summary>
    /// Lọc theo ClassroomId (optional)
    /// </summary>
    public int? ClassroomId { get; set; }
}
