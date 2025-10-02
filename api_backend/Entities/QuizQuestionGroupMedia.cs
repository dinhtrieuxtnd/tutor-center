using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class QuizQuestionGroupMedia
{
    public int Id { get; set; }

    public int GroupId { get; set; }

    public int MediaId { get; set; }

    public int OrderIndex { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual QuizQuestionGroup Group { get; set; } = null!;

    public virtual Medium Media { get; set; } = null!;
}
