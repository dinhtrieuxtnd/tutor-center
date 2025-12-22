using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;
using TutorCenterBackend.Infrastructure.Helpers;

namespace TutorCenterBackend.Infrastructure.Repositories;

public class UserRepository(AppDbContext context) : IUserRepository
{
    private readonly AppDbContext _context = context;

    public async Task<bool> EmailExistsAsync(string email, CancellationToken ct = default)
    {
        return await _context.Users
            .AnyAsync(u => u.Email == email, ct);
    }

    public async Task<User?> FindByEmailAsync(string email, CancellationToken ct = default)
    {
        return await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == email, ct);
    }

    public async Task<User?> FindWithRoleByIdAsync(int userId, CancellationToken ct = default)
    {
        return await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.UserId == userId, ct);
    }

    public async Task<IEnumerable<string>> GetUserPermissionsAsync(int userId, CancellationToken ct = default)
    {
        return await _context.Users
            .Where(u => u.UserId == userId && u.IsActive)
            .Select(u => u.Role)
            .SelectMany(r => r.Permissions)
            .Select(p => p.PermissionName)
            .Distinct()
            .ToListAsync(ct);
    }

    public async Task CreateUserAsync(User user, CancellationToken ct = default)
    {
        await _context.Users.AddAsync(user, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<User?> FindByIdAsync(int userId, CancellationToken ct = default)
    {
        return await _context.Users
            .Include(u => u.AvatarMedia)
            .FirstOrDefaultAsync(u => u.UserId == userId, ct);
    }

    public async Task<User> UpdateUserAsync(User user, CancellationToken ct = default)
    {
        return await Task.Run(() =>
        {
            _context.Users.Update(user);
            _context.SaveChanges();
            return user;
        }, ct);
    }

    public async Task<(IEnumerable<User> Users, int Total)> GetUsersPaginatedAsync(
        BaseRoleEnum role,
        bool isActive,
        int page,
        int limit,
        UserSortByEnum sortBy,
        EnumOrder order,
        string? search = null,
        CancellationToken ct = default)
    {
        var query = _context.Users
            .Include(u => u.Role)
            .Include(u => u.AvatarMedia)
            .Where(u => u.RoleId == (int)role && u.IsActive == isActive);

        // Apply search filter
        query = query.ApplySearch(search, u => u.FullName, u => u.Email);

        // Apply sorting based on sortBy field
        query = sortBy switch
        {
            UserSortByEnum.FULL_NAME => query.ApplySorting(u => u.FullName, order),
            UserSortByEnum.EMAIL => query.ApplySorting(u => u.Email, order),
            UserSortByEnum.CREATED_AT => query.ApplySorting(u => u.CreatedAt, order),
            _ => query.ApplySorting(u => u.CreatedAt, order)
        };

        // Execute query with pagination
        return await query.ExecutePaginatedQueryAsync(page, limit, ct);
    }
}
