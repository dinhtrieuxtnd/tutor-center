using FluentValidation;
using TutorCenterBackend.Application.DTOs.QuestionGroup.Requests;

namespace TutorCenterBackend.Application.Validators
{
    public class UpdateQGroupValidator : AbstractValidator<UpdateQGroupRequestDto>
    {
        public UpdateQGroupValidator()
        {
            RuleFor(x => x.SectionId)
                .GreaterThan(0).When(x => x.SectionId.HasValue).WithMessage("Id phần bài kiểm tra phải lớn hơn 0.");
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Tiêu đề là bắt buộc.");
            RuleFor(x => x.IntroText)
                .MaximumLength(1000).WithMessage("Văn bản giới thiệu không được vượt quá 1000 ký tự.");
            RuleFor(x => x.OrderIndex)
                .GreaterThanOrEqualTo(0).WithMessage("Chỉ số thứ tự phải lớn hơn hoặc bằng 0.");
            RuleFor(x => x.ShuffleInside)
                .NotNull().WithMessage("Trường xáo trộn bên trong là bắt buộc.");
        }
    }
}