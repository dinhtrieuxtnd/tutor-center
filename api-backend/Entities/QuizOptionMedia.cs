using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class QuizOptionMedia
{
    public int Id { get; set; }

    public int OptionId { get; set; }

    public int MediaId { get; set; }

    public int OrderIndex { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Medium Media { get; set; } = null!;

    public virtual QuizOption Option { get; set; } = null!;
}
