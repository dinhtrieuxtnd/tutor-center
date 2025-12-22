using FluentValidation;
using TutorCenterBackend.Application.DTOs.Classroom.Requests;

namespace TutorCenterBackend.Application.Validators.Classroom
{
    public class CreateClassroomValidator : AbstractValidator<CreateClassroomRequestDto>
    {
        public CreateClassroomValidator()
        {
            RuleFor(x => x.TutorId)
                .NotEmpty().WithMessage("ID gia sư không được để trống.")
                .GreaterThan(0).WithMessage("ID gia sư không hợp lệ.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Tên lớp học không được để trống.")
                .MaximumLength(100).WithMessage("Tên lớp học không được vượt quá 100 ký tự.");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Mô tả không được vượt quá 500 ký tự.");

            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0).WithMessage("Học phí phải là số không âm.");

            RuleFor(x => x.CoverMediaId)
                .GreaterThan(0).When(x => x.CoverMediaId.HasValue)
                .WithMessage("ID ảnh bìa không hợp lệ.");
        }
    }
}