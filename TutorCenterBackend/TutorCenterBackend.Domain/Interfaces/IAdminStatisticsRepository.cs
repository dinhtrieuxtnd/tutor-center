namespace TutorCenterBackend.Domain.Interfaces;

/// <summary>
/// Repository cho các truy vấn thống kê Admin
/// Returns primitive types và value tuples theo nguyên tắc Clean Architecture
/// </summary>
public interface IAdminStatisticsRepository
{
    /// <summary>
    /// Đếm tổng số gia sư (RoleId = 2)
    /// </summary>
    Task<int> CountTotalTutorsAsync(CancellationToken ct = default);

    /// <summary>
    /// Đếm số gia sư đang hoạt động
    /// </summary>
    Task<int> CountActiveTutorsAsync(CancellationToken ct = default);

    /// <summary>
    /// Đếm tổng số học sinh (RoleId = 3)
    /// </summary>
    Task<int> CountTotalStudentsAsync(CancellationToken ct = default);

    /// <summary>
    /// Đếm số học sinh đang hoạt động
    /// </summary>
    Task<int> CountActiveStudentsAsync(CancellationToken ct = default);

    /// <summary>
    /// Đếm tổng số lớp học
    /// </summary>
    Task<int> CountTotalClassroomsAsync(CancellationToken ct = default);

    /// <summary>
    /// Đếm số lớp học đang hoạt động (chưa archive, chưa delete)
    /// </summary>
    Task<int> CountActiveClassroomsAsync(CancellationToken ct = default);

    /// <summary>
    /// Đếm số lớp học đã archive
    /// </summary>
    Task<int> CountArchivedClassroomsAsync(CancellationToken ct = default);

    /// <summary>
    /// Tính tổng doanh thu hệ thống
    /// </summary>
    Task<decimal> CalculateTotalSystemRevenueAsync(CancellationToken ct = default);

    /// <summary>
    /// Đếm tổng số giao dịch thành công
    /// </summary>
    Task<int> CountTotalTransactionsAsync(CancellationToken ct = default);

    /// <summary>
    /// Lấy top tutors (TutorId, Name, Email, ClassroomCount, StudentCount, Revenue)
    /// </summary>
    Task<List<(int TutorId, string Name, string Email, int ClassroomCount, int StudentCount, decimal Revenue)>>
        GetTopTutorsAsync(int limit, CancellationToken ct = default);

    /// <summary>
    /// Lấy dữ liệu tăng trưởng theo thời gian (Date, NewTutors, NewStudents, NewClassrooms)
    /// </summary>
    Task<List<(DateTime Date, int NewTutors, int NewStudents, int NewClassrooms)>>
        GetGrowthTimeSeriesAsync(DateTime startDate, DateTime endDate, CancellationToken ct = default);

    /// <summary>
    /// Lấy dữ liệu doanh thu hệ thống theo thời gian (Date, Revenue, TransactionCount, StudentCount)
    /// </summary>
    Task<List<(DateTime Date, decimal Revenue, int TransactionCount, int StudentCount)>>
        GetSystemRevenueTimeSeriesAsync(DateTime startDate, DateTime endDate, CancellationToken ct = default);
}
