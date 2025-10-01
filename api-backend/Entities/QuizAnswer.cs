using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class QuizAnswer
{
    public int AttemptId { get; set; }

    public int QuestionId { get; set; }

    public int OptionId { get; set; }

    public virtual QuizAttempt Attempt { get; set; } = null!;

    public virtual QuizOption Option { get; set; } = null!;

    public virtual QuizQuestion Question { get; set; } = null!;
}
