using System.Linq.Expressions;

namespace api_backend.Repositories.Abstracts
{
    public interface IBaseRepository<T> where T : class
    {
        Task<T?> GetAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
        Task AddAsync(T entity, CancellationToken ct = default);
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}
