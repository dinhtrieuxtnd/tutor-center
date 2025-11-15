namespace api_backend.DTOs.Response
{
    public class QuizAnswerDto
    {
        public int AttemptId { get; set; }
        public int QuestionId { get; set; }
        public int OptionId { get; set; }
    }
}
