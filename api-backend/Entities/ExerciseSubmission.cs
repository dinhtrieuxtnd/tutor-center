using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class ExerciseSubmission
{
    public int SubmissionId { get; set; }

    public int ExerciseId { get; set; }

    public int StudentId { get; set; }

    public int MediaId { get; set; }

    public DateTime SubmittedAt { get; set; }

    public decimal? Score { get; set; }

    public string? Comment { get; set; }

    public int? GradedBy { get; set; }

    public DateTime? GradedAt { get; set; }

    public virtual Exercise Exercise { get; set; } = null!;

    public virtual User? GradedByNavigation { get; set; }

    public virtual Medium Media { get; set; } = null!;

    public virtual User Student { get; set; } = null!;
}
