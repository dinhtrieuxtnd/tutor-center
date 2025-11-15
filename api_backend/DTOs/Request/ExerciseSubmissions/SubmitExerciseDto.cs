using System.ComponentModel.DataAnnotations;

namespace api_backend.DTOs.Request.ExerciseSubmissions
{
    public class SubmitExerciseDto
    {
        [Required(ErrorMessage = "MediaId là bắt buộc")]
        public int MediaId { get; set; }
    }
}
