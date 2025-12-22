using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.DTOs.User
{
    public class GetUsersQueryDto : GetListQueryDto
    {
        public BaseRoleEnum Role { get; set; } = BaseRoleEnum.STUDENT;
        public bool IsActive { get; set; } = true;
        public UserSortByEnum SortBy { get; set; } = UserSortByEnum.CREATED_AT;
    }
}
