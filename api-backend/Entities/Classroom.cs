using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class Classroom
{
    public int ClassroomId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int TeacherId { get; set; }

    public int? CoverMediaId { get; set; }

    public bool IsArchived { get; set; }

    public decimal? TuitionAmount { get; set; }

    public DateTime? TuitionDueAt { get; set; }

    public bool IsTuitionRequired { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Aiconversation> Aiconversations { get; set; } = new List<Aiconversation>();

    public virtual ICollection<Announcement> Announcements { get; set; } = new List<Announcement>();

    public virtual ICollection<ClassroomChatMessage> ClassroomChatMessages { get; set; } = new List<ClassroomChatMessage>();

    public virtual ICollection<ClassroomStudent> ClassroomStudents { get; set; } = new List<ClassroomStudent>();

    public virtual Medium? CoverMedia { get; set; }

    public virtual User CreatedByNavigation { get; set; } = null!;

    public virtual ICollection<JoinRequest> JoinRequests { get; set; } = new List<JoinRequest>();

    public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();

    public virtual ICollection<PaymentTransaction> PaymentTransactions { get; set; } = new List<PaymentTransaction>();

    public virtual User Teacher { get; set; } = null!;
}
