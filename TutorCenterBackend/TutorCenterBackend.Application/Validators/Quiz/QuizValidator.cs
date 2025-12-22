using FluentValidation;
using TutorCenterBackend.Application.DTOs.Quiz.Requests;

namespace TutorCenterBackend.Application.Validators
{
    public class CreateQuizValidator : AbstractValidator<QuizRequestDto>
    {
        public CreateQuizValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Tiêu đề không được để trống")
                .MaximumLength(200).WithMessage("Tiêu đề không được vượt quá 200 ký tự");
            RuleFor(x => x.Description)
                .MaximumLength(1000).WithMessage("Mô tả không được vượt quá 1000 ký tự");
            RuleFor(x => x.TimeLimitSec)
                .GreaterThan(0).WithMessage("Thời gian làm bài phải lớn hơn 0");
            RuleFor(x => x.GradingMethod)
                .IsInEnum().WithMessage("Phương thức chấm điểm không hợp lệ");
        }
    }
}