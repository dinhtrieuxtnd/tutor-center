using FluentValidation;
using TutorCenterBackend.Application.DTOs.JoinRequest.Requests;

namespace TutorCenterBackend.Application.Validators.JoinRequest
{
    public class CreateJoinRequestValidator : AbstractValidator<CreateJoinRequestRequestDto>
    {
        public CreateJoinRequestValidator()
        {
            RuleFor(x => x.ClassRoomId)
                .GreaterThan(0).WithMessage("ID lớp học phải là số nguyên lớn hơn 0.");
        }
    }
}