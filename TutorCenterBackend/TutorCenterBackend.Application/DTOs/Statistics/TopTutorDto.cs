namespace TutorCenterBackend.Application.DTOs.Statistics;

public class TopTutorDto
{
    public int TutorId { get; set; }
    public string TutorName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public int ClassroomCount { get; set; }
    public int StudentCount { get; set; }
    public decimal TotalRevenue { get; set; }
}
