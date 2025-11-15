using System.Linq.Expressions;

namespace api_backend.Repositories.Abstracts
{
    public interface IBaseRepository<T> where T : class
    {
        Task<T?> GetAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
        Task<T?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<List<T>> GetAllAsync(CancellationToken ct = default);
        IQueryable<T> GetQueryable();
        Task AddAsync(T entity, CancellationToken ct = default);
        Task UpdateAsync(T entity, CancellationToken ct = default);
        Task DeleteAsync(T entity, CancellationToken ct = default);
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}
