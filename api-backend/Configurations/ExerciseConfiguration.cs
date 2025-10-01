using api_backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api_backend.Configurations
{
    public class ExerciseConfiguration : IEntityTypeConfiguration<Exercise>
    {
        public void Configure(EntityTypeBuilder<Exercise> builder)
        {
            builder.HasKey(e => e.ExerciseId).HasName("PK__Exercise__A074AD2F61AF41D3");

            builder.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            
            builder.Property(e => e.DueAt).HasPrecision(0);
            builder.Property(e => e.Title).HasMaxLength(200);

            builder.HasOne(d => d.AttachMedia).WithMany(p => p.Exercises)
                .HasForeignKey(d => d.AttachMediaId)
                .HasConstraintName("FK__Exercises__Attac__73BA3083");

            builder.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Exercises)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Exercises__Creat__74AE54BC");

            builder.HasOne(d => d.Lesson).WithMany(p => p.Exercises)
                .HasForeignKey(d => d.LessonId)
                .HasConstraintName("FK__Exercises__Lesso__72C60C4A");
        }
    }
}