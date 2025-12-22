using FluentValidation;
using TutorCenterBackend.Application.DTOs.Auth.Requests;

namespace TutorCenterBackend.Application.Validators.Auth
{
    public class RefreshTokenValidator : AbstractValidator<RefreshTokenRequestDto>
    {
        public RefreshTokenValidator()
        {
            RuleFor(x => x.RefreshToken)
                .NotEmpty().WithMessage("Refresh token là bắt buộc");
        }
    }
}