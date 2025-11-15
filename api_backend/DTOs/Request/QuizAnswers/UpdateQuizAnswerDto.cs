using System.ComponentModel.DataAnnotations;

namespace api_backend.DTOs.Request.QuizAnswers
{
    public class UpdateQuizAnswerDto
    {
        [Required]
        public int OptionId { get; set; }
    }
}
