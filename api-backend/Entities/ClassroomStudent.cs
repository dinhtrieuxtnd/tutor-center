using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class ClassroomStudent
{
    public int ClassroomId { get; set; }

    public int StudentId { get; set; }

    public DateTime JoinedAt { get; set; }

    public byte Status { get; set; }

    public bool IsPaid { get; set; }

    public DateTime? PaidAt { get; set; }

    public virtual Classroom Classroom { get; set; } = null!;

    public virtual ICollection<PaymentTransaction> PaymentTransactions { get; set; } = new List<PaymentTransaction>();

    public virtual User Student { get; set; } = null!;
}
