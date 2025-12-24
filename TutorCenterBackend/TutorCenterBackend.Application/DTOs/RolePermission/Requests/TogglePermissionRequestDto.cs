namespace TutorCenterBackend.Application.DTOs.RolePermission.Requests
{
    public class TogglePermissionRequestDto
    {
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
    }
}
