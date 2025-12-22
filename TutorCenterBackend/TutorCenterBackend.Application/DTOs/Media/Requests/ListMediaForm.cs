namespace TutorCenterBackend.Application.DTOs.Media.Requests
{
    public class ListMediaForm
    {
        public string? Visibility { get; set; }
        public int? UploadedBy { get; set; }
        public string? MimeType { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
