using FluentValidation;
using TutorCenterBackend.Application.DTOs.JoinRequest.Requests;

namespace TutorCenterBackend.Application.Validators.JoinRequest
{
    public class HandleJoinRequestValidator : AbstractValidator<HandleJoinRequestRequestDto>
    {
        public HandleJoinRequestValidator()
        {
            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Trạng thái yêu cầu tham gia không hợp lệ.");
        }
    }
}