using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace api_backend.Extensions
{
    public static class ModelBuilderExtensions
    {
        public static void ApplyAllConfigurations(this ModelBuilder modelBuilder)
        {
            // Automatically apply all IEntityTypeConfiguration from the current assembly
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}