using FluentValidation;
using TutorCenterBackend.Application.DTOs.QuestionOption.Requests;

namespace TutorCenterBackend.Application.Validators.QuestionOption
{
    public class UpdateOptionValidator : AbstractValidator<UpdateOptionRequestDto>
    {
        public UpdateOptionValidator()
        {
            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Nội dung không được để trống.")
                .MaximumLength(1000).WithMessage("Nội dung không được vượt quá 1000 ký tự.");
            RuleFor(x => x.IsCorrect)
                .NotNull().WithMessage("Trạng thái đúng/sai không được để trống.");
            RuleFor(x => x.OrderIndex)
                .GreaterThanOrEqualTo(0).WithMessage("Chỉ số thứ tự phải lớn hơn hoặc bằng 0.");
        }
    }   
}