using api_backend.DTOs.Request.Users;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Services.Implements
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _users;
        private readonly PasswordHasher _hasher;

        public UserService(IUserRepository users, PasswordHasher hasher)
        {
            _users = users;
            _hasher = hasher;
        }

        public async Task<PagedResultDto<UserDto>> GetAllStudentsAsync(GetUsersQueryDto query, CancellationToken ct = default)
        {
            return await GetUsersByRoleAsync("student", query, ct);
        }

        public async Task<PagedResultDto<UserDto>> GetAllTutorsAsync(GetUsersQueryDto query, CancellationToken ct = default)
        {
            return await GetUsersByRoleAsync("tutor", query, ct);
        }

        private async Task<PagedResultDto<UserDto>> GetUsersByRoleAsync(string role, GetUsersQueryDto query, CancellationToken ct = default)
        {
            var usersQuery = _users.GetQueryable()
                .Where(u => u.Role.ToLower() == role.ToLower());

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(query.SearchTerm))
            {
                var searchTerm = query.SearchTerm.ToLower();
                usersQuery = usersQuery.Where(u =>
                    u.FullName.ToLower().Contains(searchTerm) ||
                    u.Email.ToLower().Contains(searchTerm) ||
                    u.PhoneNumber.Contains(searchTerm));
            }

            // Apply IsActive filter
            if (query.IsActive.HasValue)
            {
                usersQuery = usersQuery.Where(u => u.IsActive == query.IsActive.Value);
            }

            // Get total count
            var totalCount = await usersQuery.CountAsync(ct);

            // Apply pagination
            var users = await usersQuery
                .OrderByDescending(u => u.CreatedAt)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    Role = u.Role,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                })
                .ToListAsync(ct);

            return new PagedResultDto<UserDto>
            {
                Items = users,
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<UserDto?> CreateTutorAsync(CreateTutorRequestDto dto, CancellationToken ct = default)
        {
            var email = dto.Email.Trim().ToLowerInvariant();

            // Check if email already exists
            var existingUser = await _users.GetQueryable()
                .FirstOrDefaultAsync(u => u.Email == email, ct);

            if (existingUser != null)
                throw new InvalidOperationException("Email đã tồn tại trong hệ thống.");

            // Create new tutor
            var tutor = new User
            {
                FullName = dto.FullName.Trim(),
                Email = email,
                PhoneNumber = dto.PhoneNumber.Trim(),
                PasswordHash = Convert.ToBase64String(_hasher.HashPassword(dto.Password)),
                Role = "tutor",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _users.AddAsync(tutor, ct);
            await _users.SaveChangesAsync(ct);

            return new UserDto
            {
                UserId = tutor.UserId,
                FullName = tutor.FullName,
                Email = tutor.Email,
                PhoneNumber = tutor.PhoneNumber,
                Role = tutor.Role,
                IsActive = tutor.IsActive,
                CreatedAt = tutor.CreatedAt,
                UpdatedAt = tutor.UpdatedAt
            };
        }

        public async Task<bool> UpdateUserStatusAsync(int userId, bool isActive, CancellationToken ct = default)
        {
            var user = await _users.GetByIdAsync(userId, ct);
            if (user == null) return false;

            user.IsActive = isActive;
            user.UpdatedAt = DateTime.UtcNow;
            await _users.SaveChangesAsync(ct);

            return true;
        }
    }
}
