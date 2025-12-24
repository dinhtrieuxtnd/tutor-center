using FluentValidation;
using TutorCenterBackend.Application.DTOs.QuizAnswer.Requests;

namespace TutorCenterBackend.Application.Validators.QuizAnswer
{
    public class UpdateQuizAnswerValidator : AbstractValidator<UpdateQuizAnswerRequestDto>
    {
        public UpdateQuizAnswerValidator()
        {
            RuleFor(x => x.AttemptId)
                .GreaterThan(0).WithMessage("Id bài làm phải lớn hơn 0.");
            
            RuleFor(x => x.QuestionId)
                .GreaterThan(0).WithMessage("Id câu hỏi phải lớn hơn 0.");
            
            RuleFor(x => x.OptionIds)
                .NotNull().WithMessage("Danh sách đáp án không được null.")
                .NotEmpty().WithMessage("Phải chọn ít nhất một đáp án.")
                .Must(x => x.All(id => id > 0)).WithMessage("Tất cả id đáp án phải lớn hơn 0.");
        }
    }
}
