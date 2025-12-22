using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.DTOs.Classroom.Requests
{
    public class GetClassroomsQueryDto : GetListQueryDto
    {
        public bool IsArchived { get; set; } = false;
        public ClassroomSortByEnum SortBy { get; set; } = ClassroomSortByEnum.CREATED_AT;
    }
}