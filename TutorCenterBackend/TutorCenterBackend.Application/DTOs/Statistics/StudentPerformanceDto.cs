namespace TutorCenterBackend.Application.DTOs.Statistics;

public class StudentPerformanceDto
{
    public int StudentId { get; set; }
    public string StudentName { get; set; } = null!;
    public string Email { get; set; } = null!;

    /// <summary>
    /// Số bài tập đã nộp
    /// </summary>
    public int SubmittedExercises { get; set; }

    /// <summary>
    /// Số bài tập tổng
    /// </summary>
    public int TotalExercises { get; set; }

    /// <summary>
    /// Số bài quiz đã làm
    /// </summary>
    public int CompletedQuizzes { get; set; }

    /// <summary>
    /// Số bài quiz tổng
    /// </summary>
    public int TotalQuizzes { get; set; }

    /// <summary>
    /// Điểm trung bình bài tập
    /// </summary>
    public decimal? AverageExerciseScore { get; set; }

    /// <summary>
    /// Điểm trung bình quiz (thang 10)
    /// </summary>
    public decimal? AverageQuizScore { get; set; }

    /// <summary>
    /// Tỷ lệ hoàn thành (%)
    /// </summary>
    public decimal CompletionRate { get; set; }
}
