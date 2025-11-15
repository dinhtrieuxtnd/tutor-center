using System;

namespace api_backend.Entities;

public partial class OtpRecord
{
    public long OtpRecordId { get; set; }

    public string Email { get; set; } = null!;

    public string OtpCode { get; set; } = null!;

    public string CodeType { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime ExpiresAt { get; set; }
}
