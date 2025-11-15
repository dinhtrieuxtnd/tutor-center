using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext db) : base(db) { }

        public async Task<bool> EmailExistsAsync(string email, CancellationToken ct = default)
            => await _db.Users.AnyAsync(u => u.Email == email, ct);

        public async Task<User?> FindByEmailAsync(string email, CancellationToken ct = default)
            => await _db.Users.FirstOrDefaultAsync(u => u.Email == email, ct);

        public async Task<User?> FindWithRoleByIdAsync(int userId, CancellationToken ct = default)
        {
            return await _db.Users
                .FirstOrDefaultAsync(u => u.UserId == userId, ct);
        }

        public override async Task<User?> GetByIdAsync(int id, CancellationToken ct = default)
            => await _db.Users.FirstOrDefaultAsync(u => u.UserId == id, ct);
    }
}
