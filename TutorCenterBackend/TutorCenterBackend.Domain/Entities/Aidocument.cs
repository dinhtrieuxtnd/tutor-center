using System;

namespace TutorCenterBackend.Domain.Entities;

public partial class Aidocument
{
    public int DocumentId { get; set; }

    public int MediaId { get; set; }

    public int? ClassroomId { get; set; }

    public int UploadedBy { get; set; }

    public string? ExtractedText { get; set; }

    public string ProcessingStatus { get; set; } = "pending";

    public string? ErrorMessage { get; set; }

    public string? FileType { get; set; }

    public int? PageCount { get; set; }

    public int? CharacterCount { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? ProcessedAt { get; set; }

    // Navigation properties
    public virtual Medium Media { get; set; } = null!;

    public virtual Classroom? Classroom { get; set; }

    public virtual User UploadedByUser { get; set; } = null!;

    public virtual ICollection<AigeneratedQuestion> AigeneratedQuestions { get; set; } = new List<AigeneratedQuestion>();

    public virtual ICollection<AigenerationJob> AigenerationJobs { get; set; } = new List<AigenerationJob>();
}
