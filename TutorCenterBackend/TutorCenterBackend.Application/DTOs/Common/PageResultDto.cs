using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.DTOs.Common
{
    public class PageResultDto<T>
    {
        public int Page { get; set; }
        public int Limit { get; set; }
        public int Total { get; set; }
        public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
    }
}