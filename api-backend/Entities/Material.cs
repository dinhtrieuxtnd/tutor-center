using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class Material
{
    public int MaterialId { get; set; }

    public int? LessonId { get; set; }

    public string Title { get; set; } = null!;

    public int MediaId { get; set; }

    public int UploadedBy { get; set; }

    public DateTime UploadedAt { get; set; }

    public virtual Lesson? Lesson { get; set; }

    public virtual Medium Media { get; set; } = null!;

    public virtual User UploadedByNavigation { get; set; } = null!;
}
