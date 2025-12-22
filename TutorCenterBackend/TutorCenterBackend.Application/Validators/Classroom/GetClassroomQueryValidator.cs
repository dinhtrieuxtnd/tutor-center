using FluentValidation;
using TutorCenterBackend.Application.DTOs.Classroom.Requests;

namespace TutorCenterBackend.Application.Validators.Classroom
{
    public class GetClassroomQueryValidator : AbstractValidator<GetClassroomsQueryDto>
    {
        public GetClassroomQueryValidator()
        {
            RuleFor(x => x.Page)
                .GreaterThan(0).WithMessage("Chỉ số trang phải lớn hơn 0.");

            RuleFor(x => x.Limit)
                .GreaterThan(0).WithMessage("Kích thước trang phải lớn hơn 0.")
                .LessThanOrEqualTo(100).WithMessage("Kích thước trang phải nhỏ hơn hoặc bằng 100.");
            RuleFor(x => x.Order)
                .IsInEnum().WithMessage("Phương thức sắp xếp không hợp lệ.");
            RuleFor(x => x.Search)
                .MaximumLength(100).WithMessage("Chuỗi tìm kiếm không được vượt quá 100 ký tự.");
            RuleFor(x => x.IsArchived)
                .NotNull().WithMessage("Trạng thái lưu trữ không được để trống.");
            RuleFor(x => x.SortBy)
                .IsInEnum().WithMessage("Tiêu chí sắp xếp không hợp lệ.");
        }
    }
}