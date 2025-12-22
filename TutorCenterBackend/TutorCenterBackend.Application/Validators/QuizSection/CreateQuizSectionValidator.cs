using FluentValidation;
using TutorCenterBackend.Application.DTOs.QuizSection.Requests;

namespace TutorCenterBackend.Application.Validators
{
    public class CreateQuizSectionValidator : AbstractValidator<CreateQuizSectionRequestDto>
    {
        public CreateQuizSectionValidator()
        {
            RuleFor(x => x.QuizId)
                .NotEmpty().GreaterThan(0).WithMessage("Id bài kiểm tra phải lớn hơn 0.");
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Tiêu đề không được để trống.")
                .MaximumLength(200).WithMessage("Tiêu đề không được vượt quá 200 ký tự.");
            RuleFor(x => x.Description)
                .MaximumLength(1000).WithMessage("Mô tả không được vượt quá 1000 ký tự.");
            RuleFor(x => x.OrderIndex)
                .GreaterThanOrEqualTo(0).WithMessage("Chỉ số thứ tự phải lớn hơn hoặc bằng 0.");
        }
    }
}