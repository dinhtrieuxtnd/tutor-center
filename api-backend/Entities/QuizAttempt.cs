using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class QuizAttempt
{
    public int AttemptId { get; set; }

    public int QuizId { get; set; }

    public int StudentId { get; set; }

    public DateTime StartedAt { get; set; }

    public DateTime? SubmittedAt { get; set; }

    public int? DurationSec { get; set; }

    public string Status { get; set; } = null!;

    public decimal? ScoreRaw { get; set; }

    public decimal? ScoreScaled10 { get; set; }

    public DateTime? GradedAt { get; set; }

    public int? GradedBy { get; set; }

    public virtual User? GradedByNavigation { get; set; }

    public virtual Quiz Quiz { get; set; } = null!;

    public virtual ICollection<QuizAnswer> QuizAnswers { get; set; } = new List<QuizAnswer>();

    public virtual User Student { get; set; } = null!;
}
