using FluentValidation;
using TutorCenterBackend.Application.DTOs.Exercise.Requests;

namespace TutorCenterBackend.Application.Validators.Exercise
{
    public class ExerciseValidator : AbstractValidator<ExerciseRequestDto>
    {
        public ExerciseValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Tiêu đề là bắt buộc.")
                .MaximumLength(200).WithMessage("Tiêu đề không được vượt quá 200 ký tự.");

            RuleFor(x => x.Description)
                .MaximumLength(1000).WithMessage("Mô tả không được vượt quá 1000 ký tự.");

            RuleFor(x => x.AttachMediaId)
                .GreaterThan(0).When(x => x.AttachMediaId.HasValue)
                .WithMessage("Id media phải là một số nguyên dương.");
        }
    }
}