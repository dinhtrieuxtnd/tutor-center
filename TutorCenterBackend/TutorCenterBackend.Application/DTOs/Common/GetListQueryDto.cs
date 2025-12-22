using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.DTOs.Common
{
    public class GetListQueryDto
    {
        public int Page { get; set; } = 1;
        public int Limit { get; set; } = 10;
        public EnumOrder Order { get; set; } = EnumOrder.ASC;
        public string? Search { get; set; }
    }
}