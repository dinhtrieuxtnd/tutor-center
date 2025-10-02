using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class AIMessage
{
    public int MessageId { get; set; }

    public int ConversationId { get; set; }

    public string SenderRole { get; set; } = null!;

    public string? Content { get; set; }

    public int? ParentId { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<AIMessageMedia> AIMessageMedia { get; set; } = new List<AIMessageMedia>();

    public virtual AIConversation Conversation { get; set; } = null!;

    public virtual ICollection<AIMessage> InverseParent { get; set; } = new List<AIMessage>();

    public virtual AIMessage? Parent { get; set; }
}
