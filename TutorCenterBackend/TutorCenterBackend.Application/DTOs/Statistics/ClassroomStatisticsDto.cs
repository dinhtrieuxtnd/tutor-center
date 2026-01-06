namespace TutorCenterBackend.Application.DTOs.Statistics;

public class ClassroomStatisticsDto
{
    public int ClassroomId { get; set; }
    public string ClassroomName { get; set; } = null!;
    public int TotalStudents { get; set; }
    public int PaidStudents { get; set; }
    public int UnpaidStudents { get; set; }
    public decimal Revenue { get; set; }
    public int TotalLessons { get; set; }
    public int PendingSubmissions { get; set; }
}
