using FluentValidation;
using TutorCenterBackend.Application.DTOs.Auth.Requests;

namespace TutorCenterBackend.Application.Validators.Auth
{
    public class LogoutValidator : AbstractValidator<LogoutRequestDto>
    {
        public LogoutValidator()
        {
            RuleFor(x => x.RefreshToken)
                .NotEmpty().WithMessage("Refresh token là bắt buộc");
        }
    }
}