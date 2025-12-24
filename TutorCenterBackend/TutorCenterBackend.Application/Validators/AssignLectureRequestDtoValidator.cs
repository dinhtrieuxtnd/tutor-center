using FluentValidation;
using TutorCenterBackend.Application.DTOs.Lesson.Requests;

namespace TutorCenterBackend.Application.Validators
{
    public class AssignLectureRequestDtoValidator : AbstractValidator<AssignLectureRequestDto>
    {
        public AssignLectureRequestDtoValidator()
        {
            RuleFor(x => x.ClassroomId)
                .GreaterThan(0)
                .WithMessage("ClassroomId phải lớn hơn 0.");

            RuleFor(x => x.LectureId)
                .GreaterThan(0)
                .WithMessage("LectureId phải lớn hơn 0.");

            RuleFor(x => x.OrderIndex)
                .GreaterThanOrEqualTo(0)
                .WithMessage("OrderIndex phải lớn hơn hoặc bằng 0.");
        }
    }
}
