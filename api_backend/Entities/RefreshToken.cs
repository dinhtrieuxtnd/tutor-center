using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class RefreshToken
{
    public long RefreshTokenId { get; set; }

    public int UserId { get; set; }

    public string TokenHash { get; set; } = null!;

    public DateTime IssuedAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime? RevokedAt { get; set; }

    public string? ReplacedByHash { get; set; }

    public virtual User User { get; set; } = null!;
}
