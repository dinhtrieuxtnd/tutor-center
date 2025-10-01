using api_backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api_backend.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C09194761");

            builder.HasIndex(e => e.Email, "UQ__Users__A9D1053484232A97").IsUnique();

            builder.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            
            builder.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            
            builder.Property(e => e.FullName).HasMaxLength(150);
            
            builder.Property(e => e.IsActive).HasDefaultValue(true);
            
            builder.Property(e => e.PasswordHash).HasMaxLength(256);
            
            builder.Property(e => e.Phone)
                .HasMaxLength(30)
                .IsUnicode(false);
            
            builder.Property(e => e.UpdatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            builder.HasOne(d => d.AvatarMedia).WithMany(p => p.Users)
                .HasForeignKey(d => d.AvatarMediaId)
                .HasConstraintName("FK__Users__AvatarMed__4AB81AF0");

            builder.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Users__RoleId__49C3F6B7");
        }
    }
}