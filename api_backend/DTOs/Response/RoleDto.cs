namespace api_backend.DTOs.Response
{
    public class RoleDto
    {
        public int RoleId { get; set; }
        public string Name { get; set; } = ""; 
        public string? Description { get; set; }
    }
}
