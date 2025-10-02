using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class JoinRequest
{
    public int JoinRequestId { get; set; }

    public int ClassroomId { get; set; }

    public int StudentId { get; set; }

    public string Status { get; set; } = null!;

    public string? Note { get; set; }

    public DateTime RequestedAt { get; set; }

    public int? HandledBy { get; set; }

    public DateTime? HandledAt { get; set; }

    public virtual Classroom Classroom { get; set; } = null!;

    public virtual User? HandledByNavigation { get; set; }

    public virtual User Student { get; set; } = null!;
}
