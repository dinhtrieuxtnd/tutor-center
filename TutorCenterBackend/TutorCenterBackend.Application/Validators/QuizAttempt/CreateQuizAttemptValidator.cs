using FluentValidation;
using TutorCenterBackend.Application.DTOs.QuizAttempt.Requests;

namespace TutorCenterBackend.Application.Validators.QuizAttempt
{
    public class CreateQuizAttemptValidator : AbstractValidator<CreateQuizAttemptRequestDto>
    {
        public CreateQuizAttemptValidator()
        {
            RuleFor(x => x.LessonId)
                .GreaterThan(0).WithMessage("Id bài học phải lớn hơn 0.");
        }
    }
}
