using FluentValidation;
using TutorCenterBackend.Application.DTOs.Media.Requests;

namespace TutorCenterBackend.Application.Validators.Media
{
    public class UpdateMediaFormValidator : AbstractValidator<UpdateMediaForm>
    {
        public UpdateMediaFormValidator()
        {
            RuleFor(x => x.Visibility)
                .Must(v => v == null || v == "public" || v == "private")
                .WithMessage("Visibility phải là 'public' hoặc 'private'.");
        }
    }
}
