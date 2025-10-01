using api_backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api_backend.Configurations
{
    public class PermissionConfiguration : IEntityTypeConfiguration<Permission>
    {
        public void Configure(EntityTypeBuilder<Permission> builder)
        {
            builder.HasKey(e => e.PermissionId).HasName("PK__Permissi__EFA6FB2FE021AEB8");

            builder.HasIndex(e => e.Code, "UQ__Permissi__A25C5AA7A4E75D76").IsUnique();

            builder.Property(e => e.Code)
                .HasMaxLength(100)
                .IsUnicode(false);
            
            builder.Property(e => e.Description).HasMaxLength(255);
        }
    }
}