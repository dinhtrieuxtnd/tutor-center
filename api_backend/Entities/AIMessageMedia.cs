using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class AIMessageMedia
{
    public int MessageMediaId { get; set; }

    public int MessageId { get; set; }

    public int MediaId { get; set; }

    public string? Purpose { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Medium Media { get; set; } = null!;

    public virtual AIMessage Message { get; set; } = null!;
}
