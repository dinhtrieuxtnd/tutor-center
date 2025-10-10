using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IRoleRepository : IBaseRepository<Role>
    {
        Task<Role?> FindByNameAsync(string name, CancellationToken ct = default);
        Task<List<Role>> ListAsync(CancellationToken ct = default);
        Task<Role?> FindByIdAsync(int id, CancellationToken ct = default);
        Task RemoveAsync(Role entity, CancellationToken ct = default);
    }
}
