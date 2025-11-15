namespace api_backend.DTOs.Request.Media
{
    public class ListMediaForm
    {
        public string? Visibility { get; set; } // public, private, hoặc null (all)
        public int? UploadedBy { get; set; } // Lọc theo người upload
        public string? MimeType { get; set; } // Lọc theo loại file (image/*, video/*, etc.)
        public DateTime? FromDate { get; set; } // Từ ngày
        public DateTime? ToDate { get; set; } // Đến ngày
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
