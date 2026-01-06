namespace TutorCenterBackend.Domain.Interfaces;

/// <summary>
/// Repository cho các truy vấn thống kê phức tạp
/// Trả về primitive types và value tuples theo nguyên tắc Clean Architecture
/// </summary>
public interface IStatisticsRepository
{
    /// <summary>
    /// Lấy danh sách ClassroomId của tutor
    /// </summary>
    Task<List<int>> GetTutorClassroomIdsAsync(int tutorId, CancellationToken ct = default);

    /// <summary>
    /// Đếm tổng số học sinh unique của tutor (qua tất cả các lớp)
    /// </summary>
    Task<int> CountTotalStudentsByTutorAsync(int tutorId, CancellationToken ct = default);

    /// <summary>
    /// Đếm học sinh đã thanh toán của tutor
    /// </summary>
    Task<int> CountPaidStudentsByTutorAsync(int tutorId, CancellationToken ct = default);

    /// <summary>
    /// Đếm tổng số bài giảng của tutor
    /// </summary>
    Task<int> CountLecturesByTutorAsync(int tutorId, CancellationToken ct = default);

    /// <summary>
    /// Đếm tổng số bài tập của tutor
    /// </summary>
    Task<int> CountExercisesByTutorAsync(int tutorId, CancellationToken ct = default);

    /// <summary>
    /// Đếm tổng số quiz của tutor
    /// </summary>
    Task<int> CountQuizzesByTutorAsync(int tutorId, CancellationToken ct = default);

    /// <summary>
    /// Đếm số bài nộp chưa chấm của tutor
    /// </summary>
    Task<int> CountPendingSubmissionsByTutorAsync(int tutorId, CancellationToken ct = default);

    /// <summary>
    /// Đếm số join request pending của tutor
    /// </summary>
    Task<int> CountPendingJoinRequestsByTutorAsync(int tutorId, CancellationToken ct = default);

    /// <summary>
    /// Tính tổng doanh thu của tutor
    /// </summary>
    Task<decimal> CalculateTotalRevenueByTutorAsync(int tutorId, CancellationToken ct = default);

    /// <summary>
    /// Lấy thống kê theo từng lớp học (ClassroomId, ClassName, StudentCount, Revenue, LectureCount, ExerciseCount, QuizCount, PendingSubmissions)
    /// </summary>
    Task<List<(int ClassroomId, string ClassName, int StudentCount, decimal Revenue, int LectureCount, int ExerciseCount, int QuizCount, int PendingSubmissions)>> 
        GetClassroomStatisticsByTutorAsync(int tutorId, CancellationToken ct = default);

    /// <summary>
    /// Lấy dữ liệu time series doanh thu (Date, Revenue, TransactionCount, StudentCount)
    /// </summary>
    Task<List<(DateTime Date, decimal Revenue, int TransactionCount, int StudentCount)>> 
        GetRevenueTimeSeriesAsync(
            int tutorId, 
            DateTime startDate, 
            DateTime endDate, 
            int? classroomId = null, 
            CancellationToken ct = default);

    /// <summary>
    /// Lấy dữ liệu time series bài nộp (Date, SubmissionCount, GradedCount, PendingCount)
    /// </summary>
    Task<List<(DateTime Date, int SubmissionCount, int GradedCount, int PendingCount)>> 
        GetSubmissionTimeSeriesAsync(
            int tutorId, 
            DateTime startDate, 
            DateTime endDate, 
            int? classroomId = null, 
            CancellationToken ct = default);

    /// <summary>
    /// Lấy thống kê hiệu suất học sinh (StudentId, StudentName, StudentEmail, LecturesCompleted, TotalLectures, ExercisesSubmitted, TotalExercises, QuizzesAttempted, TotalQuizzes, AverageScore)
    /// </summary>
    Task<List<(int StudentId, string StudentName, string StudentEmail, int LecturesCompleted, int TotalLectures, int ExercisesSubmitted, int TotalExercises, int QuizzesAttempted, int TotalQuizzes, decimal? AverageScore)>> 
        GetStudentPerformanceByClassroomAsync(
            int classroomId, 
            CancellationToken ct = default);
}
