using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);
        Task<User?> FindByEmailAsync(string email, CancellationToken ct = default);
        Task<User?> FindWithRoleByIdAsync(int userId, CancellationToken ct = default);


        Task<List<User>> GetAllAsync(CancellationToken ct = default);
        Task<User?> GetByIdAsync(int id, CancellationToken ct = default);
    }
}
