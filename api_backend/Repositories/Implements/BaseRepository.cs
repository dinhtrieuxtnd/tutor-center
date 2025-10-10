using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using api_backend.DbContexts;

namespace api_backend.Repositories.Implements
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        protected readonly AppDbContext _db;
        protected readonly DbSet<T> _set;

        public BaseRepository(AppDbContext db)
        {
            _db = db;
            _set = _db.Set<T>();
        }

        public async Task<T?> GetAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default)
            => await _set.FirstOrDefaultAsync(predicate, ct);

        public async Task AddAsync(T entity, CancellationToken ct = default)
            => await _set.AddAsync(entity, ct);

        public async Task SaveChangesAsync(CancellationToken ct = default)
            => await _db.SaveChangesAsync(ct);
    }
}
