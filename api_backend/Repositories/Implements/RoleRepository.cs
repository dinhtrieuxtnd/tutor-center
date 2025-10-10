using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements
{
    public class RoleRepository : BaseRepository<Role>, IRoleRepository
    {
        public RoleRepository(AppDbContext db) : base(db) { }

        public async Task<Role?> FindByNameAsync(string name, CancellationToken ct = default)
            => await _db.Roles.FirstOrDefaultAsync(r => r.Name == name, ct);

        public async Task<List<Role>> ListAsync(CancellationToken ct = default)
            => await _db.Roles.AsNoTracking().OrderBy(r => r.RoleId).ToListAsync(ct);

        public async Task<Role?> FindByIdAsync(int id, CancellationToken ct = default)
            => await _db.Roles.FirstOrDefaultAsync(r => r.RoleId == id, ct);

        public Task RemoveAsync(Role entity, CancellationToken ct = default)
        {
            _db.Roles.Remove(entity);
            return Task.CompletedTask;
        }
    }
}
