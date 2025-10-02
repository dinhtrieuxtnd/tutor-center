using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class AIConversation
{
    public int ConversationId { get; set; }

    public int? AgentId { get; set; }

    public int OwnerUserId { get; set; }

    public int? ClassroomId { get; set; }

    public string? Title { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<AIMessage> AIMessages { get; set; } = new List<AIMessage>();

    public virtual AIAgent? Agent { get; set; }

    public virtual Classroom? Classroom { get; set; }

    public virtual User OwnerUser { get; set; } = null!;
}
