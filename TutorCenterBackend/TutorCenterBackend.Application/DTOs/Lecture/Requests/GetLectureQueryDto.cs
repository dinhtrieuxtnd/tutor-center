using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.DTOs.Lecture.Requests
{
    public class GetLectureQueryDto : GetListQueryDto
    {
        public LectureSortByEnum SortBy { get; set; } = LectureSortByEnum.UPLOADED_AT;
    }
}