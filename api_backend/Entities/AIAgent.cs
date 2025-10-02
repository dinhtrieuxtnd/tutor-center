using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class AIAgent
{
    public int AgentId { get; set; }

    public string Name { get; set; } = null!;

    public string? SystemPrompt { get; set; }

    public bool IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<AIConversation> AIConversations { get; set; } = new List<AIConversation>();

    public virtual User? CreatedByNavigation { get; set; }
}
