namespace TutorCenterBackend.Application.DTOs.AIDocument;

public class AIGenerationJobResponseDto
{
    public int JobId { get; set; }
    public int DocumentId { get; set; }
    public int RequestedBy { get; set; }
    public string? RequesterName { get; set; }
    public string QuestionType { get; set; } = null!;
    public int QuestionCount { get; set; }
    public string? DifficultyLevel { get; set; }
    public string Language { get; set; } = null!;
    public string JobStatus { get; set; } = null!;
    public int GeneratedCount { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}
