using System.ComponentModel.DataAnnotations;

namespace TutorCenterBackend.Application.DTOs.QuestionOption.Requests
{
    public class AttachMediaToOptionRequestDto
    {
        [Required(ErrorMessage = "MediaId là bắt buộc.")]
        public int MediaId { get; set; }
    }
}
