using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace TutorCenterBackend.Application.Helpers
{
    public static class GetCurrentUserHelper
    {
        public static int GetCurrentUserId(this HttpContext httpContext)
        {
            var userIdClaim = httpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            
            throw new UnauthorizedAccessException("Người dùng chưa đăng nhập.");
        }

        public static string? GetCurrentUserRole(this HttpContext httpContext)
        {
            return httpContext.User?.FindFirst(ClaimTypes.Role)?.Value;
        }

        // Extension method để lấy userId trực tiếp từ IHttpContextAccessor
        public static int GetCurrentUserId(this IHttpContextAccessor httpContextAccessor)
        {
            var httpContext = httpContextAccessor.HttpContext 
                ?? throw new UnauthorizedAccessException("Không tìm thấy HttpContext.");
            
            return httpContext.GetCurrentUserId();
        }

        // Extension method để lấy user role trực tiếp từ IHttpContextAccessor
        public static string? GetCurrentUserRole(this IHttpContextAccessor httpContextAccessor)
        {
            var httpContext = httpContextAccessor.HttpContext 
                ?? throw new UnauthorizedAccessException("Không tìm thấy HttpContext.");
            
            return httpContext.GetCurrentUserRole();
        }
    }
}
