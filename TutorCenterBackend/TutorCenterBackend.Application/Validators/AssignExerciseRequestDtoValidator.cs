using FluentValidation;
using TutorCenterBackend.Application.DTOs.Lesson.Requests;

namespace TutorCenterBackend.Application.Validators
{
    public class AssignExerciseRequestDtoValidator : AbstractValidator<AssignExerciseRequestDto>
    {
        public AssignExerciseRequestDtoValidator()
        {
            RuleFor(x => x.ClassroomId)
                .GreaterThan(0)
                .WithMessage("ClassroomId phải lớn hơn 0.");

            RuleFor(x => x.ExerciseId)
                .GreaterThan(0)
                .WithMessage("ExerciseId phải lớn hơn 0.");

            RuleFor(x => x.OrderIndex)
                .GreaterThanOrEqualTo(0)
                .WithMessage("OrderIndex phải lớn hơn hoặc bằng 0.");

            RuleFor(x => x.DueAt)
                .GreaterThan(DateTime.UtcNow)
                .When(x => x.DueAt.HasValue)
                .WithMessage("DueAt phải là thời gian trong tương lai.");
        }
    }
}
