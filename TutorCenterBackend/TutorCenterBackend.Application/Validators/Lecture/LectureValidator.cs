using FluentValidation;
using TutorCenterBackend.Application.DTOs.Lecture.Requests;

namespace TutorCenterBackend.Application.Validators.Lecture
{
    public class LectureValidator : AbstractValidator<LectureRequestDto>
    {
        public LectureValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Tiêu đề không được để trống.")
                .MaximumLength(200).WithMessage("Tiêu đề không được vượt quá 200 ký tự.");

            RuleFor(x => x.Content)
                .MaximumLength(2000).WithMessage("Nội dung không được vượt quá 2000 ký tự.");
            RuleFor(x => x.ParentId)
                .GreaterThan(0).When(x => x.ParentId.HasValue).WithMessage("Id bài học cha phải lớn hơn 0.");

            RuleFor(x => x.MediaId)
                .GreaterThan(0).When(x => x.MediaId.HasValue).WithMessage("Id media phải lớn hơn 0.");
        }
    }
}