using FluentValidation;
using TutorCenterBackend.Application.DTOs.RolePermission.Requests;

namespace TutorCenterBackend.Application.Validators.RolePermission
{
    public class AssignPermissionsToRoleValidator : AbstractValidator<AssignPermissionsToRoleRequestDto>
    {
        public AssignPermissionsToRoleValidator()
        {
            RuleFor(x => x.PermissionIds)
                .NotNull().WithMessage("Danh s�ch quy?n kh�ng ???c null")
                .NotEmpty().WithMessage("Ph?i ch?n �t nh?t m?t quy?n");

            RuleForEach(x => x.PermissionIds)
                .GreaterThan(0).WithMessage("ID quy?n ph?i l� s? d??ng");
        }
    }
}
