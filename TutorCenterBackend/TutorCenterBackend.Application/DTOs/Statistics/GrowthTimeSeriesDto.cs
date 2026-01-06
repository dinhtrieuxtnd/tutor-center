namespace TutorCenterBackend.Application.DTOs.Statistics;

/// <summary>
/// DTO cho biểu đồ tăng trưởng người dùng/lớp học theo thời gian
/// </summary>
public class GrowthTimeSeriesDto
{
    /// <summary>
    /// Ngày (format: yyyy-MM-dd)
    /// </summary>
    public string Date { get; set; } = null!;

    /// <summary>
    /// Số gia sư mới
    /// </summary>
    public int NewTutors { get; set; }

    /// <summary>
    /// Số học sinh mới
    /// </summary>
    public int NewStudents { get; set; }

    /// <summary>
    /// Số lớp học mới
    /// </summary>
    public int NewClassrooms { get; set; }
}
