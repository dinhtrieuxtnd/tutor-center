using FluentValidation;
using TutorCenterBackend.Application.DTOs.Question.Requests;

namespace TutorCenterBackend.Application.Validators.Question
{
    public class UpdateQuestionValidator : AbstractValidator<UpdateQuestionRequestDto>
    {
        public UpdateQuestionValidator()
        {
            RuleFor(x => x.SectionId)
                .GreaterThan(0).When(x => x.SectionId.HasValue).WithMessage("Id phần bài kiểm tra phải lớn hơn 0.");
            RuleFor(x => x.GroupId)
                .GreaterThan(0).When(x => x.GroupId.HasValue).WithMessage("Id nhóm câu hỏi phải lớn hơn 0.");
            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Nội dung câu hỏi không được để trống.")
                .MaximumLength(2000).WithMessage("Nội dung câu hỏi không được vượt quá 2000 ký tự.");
            RuleFor(x => x.Explanation)
                .MaximumLength(2000).WithMessage("Giải thích câu hỏi không được vượt quá 2000 ký tự.");
            RuleFor(x => x.QuestionType)
                .IsInEnum().WithMessage("Loại câu hỏi không hợp lệ.");
            RuleFor(x => x.Points)
                .GreaterThanOrEqualTo(0).WithMessage("Điểm của câu hỏi phải lớn hơn hoặc bằng 0.");
            RuleFor(x => x.OrderIndex)
                .GreaterThanOrEqualTo(0).WithMessage("Chỉ số thứ tự của câu hỏi phải lớn hơn hoặc bằng 0.");
        }
    }
}