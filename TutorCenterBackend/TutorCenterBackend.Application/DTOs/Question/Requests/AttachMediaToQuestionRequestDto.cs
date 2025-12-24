using System.ComponentModel.DataAnnotations;

namespace TutorCenterBackend.Application.DTOs.Question.Requests
{
    public class AttachMediaToQuestionRequestDto
    {
        [Required(ErrorMessage = "MediaId là bắt buộc.")]
        public int MediaId { get; set; }
    }
}
