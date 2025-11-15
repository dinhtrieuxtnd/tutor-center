using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class RefreshToken
{
    public string Token { get; set; } = null!;

    public int UserId { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
