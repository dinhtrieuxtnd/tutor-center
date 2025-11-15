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

        public virtual async Task<T?> GetByIdAsync(int id, CancellationToken ct = default)
            => await _set.FindAsync(new object[] { id }, ct);

        public async Task<List<T>> GetAllAsync(CancellationToken ct = default)
            => await _set.ToListAsync(ct);

        public IQueryable<T> GetQueryable()
            => _set.AsQueryable();

        public async Task AddAsync(T entity, CancellationToken ct = default)
            => await _set.AddAsync(entity, ct);

        public Task UpdateAsync(T entity, CancellationToken ct = default)
        {
            _set.Update(entity);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(T entity, CancellationToken ct = default)
        {
            _set.Remove(entity);
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync(CancellationToken ct = default)
            => await _db.SaveChangesAsync(ct);
    }
}
