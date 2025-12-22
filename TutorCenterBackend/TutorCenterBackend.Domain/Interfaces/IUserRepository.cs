using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);
        Task<User?> FindByEmailAsync(string email, CancellationToken ct = default);
        Task<User?> FindWithRoleByIdAsync(int userId, CancellationToken ct = default);
        Task<IEnumerable<string>> GetUserPermissionsAsync(int userId, CancellationToken ct = default);
        Task CreateUserAsync (User user, CancellationToken ct = default);
        Task<User?> FindByIdAsync(int userId, CancellationToken ct = default);
        Task<User> UpdateUserAsync(User user, CancellationToken ct = default);
        Task<(IEnumerable<User> Users, int Total)> GetUsersPaginatedAsync(
            BaseRoleEnum role,
            bool isActive,
            int page,
            int limit,
            UserSortByEnum sortBy,
            EnumOrder order,
            string? search = null,
            CancellationToken ct = default);
    }
}
