using System.ComponentModel.DataAnnotations;

namespace TutorCenterBackend.Application.DTOs.QuestionGroup.Requests
{
    public class AttachMediaToQGroupRequestDto
    {
        [Required(ErrorMessage = "MediaId là bắt buộc.")]
        public int MediaId { get; set; }
    }
}
