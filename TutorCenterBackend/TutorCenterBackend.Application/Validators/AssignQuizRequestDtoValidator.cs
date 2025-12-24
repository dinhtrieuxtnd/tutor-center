using FluentValidation;
using TutorCenterBackend.Application.DTOs.Lesson.Requests;

namespace TutorCenterBackend.Application.Validators
{
    public class AssignQuizRequestDtoValidator : AbstractValidator<AssignQuizRequestDto>
    {
        public AssignQuizRequestDtoValidator()
        {
            RuleFor(x => x.ClassroomId)
                .GreaterThan(0)
                .WithMessage("ClassroomId phải lớn hơn 0.");

            RuleFor(x => x.QuizId)
                .GreaterThan(0)
                .WithMessage("QuizId phải lớn hơn 0.");

            RuleFor(x => x.OrderIndex)
                .GreaterThanOrEqualTo(0)
                .WithMessage("OrderIndex phải lớn hơn hoặc bằng 0.");

            RuleFor(x => x.StartAt)
                .GreaterThan(DateTime.UtcNow)
                .WithMessage("StartAt phải là thời gian trong tương lai.");

            RuleFor(x => x.EndAt)
                .GreaterThan(x => x.StartAt)
                .WithMessage("EndAt phải sau StartAt.");
        }
    }
}
