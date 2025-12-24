using System.Text;
using TutorCenterBackend.Application.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation;

public class AIQuestionGeneratorService : IAIQuestionGeneratorService
{
    private readonly IAIProviderService _aiProvider;

    public AIQuestionGeneratorService(IAIProviderService aiProvider)
    {
        _aiProvider = aiProvider;
    }

    public async Task<List<GeneratedQuestionDto>> GenerateQuestionsAsync(
        string documentText,
        string questionType,
        int count,
        string? difficultyLevel,
        string language,
        CancellationToken ct = default)
    {
        var prompt = BuildPrompt(documentText, questionType, count, difficultyLevel, language);

        var response = await _aiProvider.GenerateStructuredContentAsync<AIQuestionGeneratorResponse>(prompt, ct);

        if (response?.Questions == null || response.Questions.Count == 0)
        {
            throw new Exception("AI did not generate any questions.");
        }

        return response.Questions;
    }

    private string BuildPrompt(string documentText, string questionType, int count, string? difficultyLevel, string language)
    {
        var isVietnamese = language.ToLowerInvariant() == "vi";
        var sb = new StringBuilder();

        if (isVietnamese)
        {
            sb.AppendLine("Bạn là một chuyên gia tạo câu hỏi kiểm tra. Dựa trên tài liệu dưới đây, hãy tạo các câu hỏi kiểm tra.");
        }
        else
        {
            sb.AppendLine("You are an expert at creating quiz questions. Based on the document below, create quiz questions.");
        }

        sb.AppendLine();
        sb.AppendLine("=== DOCUMENT CONTENT ===");
        sb.AppendLine(TruncateText(documentText, 30000)); // Giới hạn để tránh token limit
        sb.AppendLine("=== END DOCUMENT ===");
        sb.AppendLine();

        // Instructions based on question type
        switch (questionType.ToLowerInvariant())
        {
            case "multiplechoice":
                AppendMultipleChoiceInstructions(sb, count, difficultyLevel, isVietnamese);
                break;
            case "truefalse":
                AppendTrueFalseInstructions(sb, count, difficultyLevel, isVietnamese);
                break;
            case "shortanswer":
                AppendShortAnswerInstructions(sb, count, difficultyLevel, isVietnamese);
                break;
            case "fillinblank":
                AppendFillInBlankInstructions(sb, count, difficultyLevel, isVietnamese);
                break;
            case "mixed":
                AppendMixedInstructions(sb, count, difficultyLevel, isVietnamese);
                break;
            default:
                throw new ArgumentException($"Unsupported question type: {questionType}");
        }

        sb.AppendLine();
        AppendJsonFormatInstructions(sb, isVietnamese);

        return sb.ToString();
    }

    private void AppendMultipleChoiceInstructions(StringBuilder sb, int count, string? difficulty, bool isVi)
    {
        if (isVi)
        {
            sb.AppendLine($"Hãy tạo {count} câu hỏi trắc nghiệm (Multiple Choice) từ tài liệu.");
            sb.AppendLine("Mỗi câu hỏi phải có:");
            sb.AppendLine("- 1 câu hỏi rõ ràng, dễ hiểu");
            sb.AppendLine("- 4 đáp án (A, B, C, D)");
            sb.AppendLine("- CHỈ 1 đáp án đúng");
            sb.AppendLine("- Giải thích ngắn gọn tại sao đáp án đó đúng");
            sb.AppendLine("- Chủ đề của câu hỏi");
            if (!string.IsNullOrEmpty(difficulty))
                sb.AppendLine($"- Độ khó: {difficulty}");
        }
        else
        {
            sb.AppendLine($"Create {count} Multiple Choice questions from the document.");
            sb.AppendLine("Each question must have:");
            sb.AppendLine("- 1 clear, understandable question");
            sb.AppendLine("- 4 options (A, B, C, D)");
            sb.AppendLine("- ONLY 1 correct answer");
            sb.AppendLine("- Brief explanation why that answer is correct");
            sb.AppendLine("- Topic of the question");
            if (!string.IsNullOrEmpty(difficulty))
                sb.AppendLine($"- Difficulty: {difficulty}");
        }
    }

    private void AppendTrueFalseInstructions(StringBuilder sb, int count, string? difficulty, bool isVi)
    {
        if (isVi)
        {
            sb.AppendLine($"Hãy tạo {count} câu hỏi Đúng/Sai (True/False) từ tài liệu.");
            sb.AppendLine("Mỗi câu hỏi phải có:");
            sb.AppendLine("- 1 phát biểu rõ ràng");
            sb.AppendLine("- 2 đáp án: Đúng và Sai");
            sb.AppendLine("- Giải thích tại sao phát biểu đúng hoặc sai");
            if (!string.IsNullOrEmpty(difficulty))
                sb.AppendLine($"- Độ khó: {difficulty}");
        }
        else
        {
            sb.AppendLine($"Create {count} True/False questions from the document.");
            sb.AppendLine("Each question must have:");
            sb.AppendLine("- 1 clear statement");
            sb.AppendLine("- 2 options: True and False");
            sb.AppendLine("- Explanation why the statement is true or false");
            if (!string.IsNullOrEmpty(difficulty))
                sb.AppendLine($"- Difficulty: {difficulty}");
        }
    }

    private void AppendShortAnswerInstructions(StringBuilder sb, int count, string? difficulty, bool isVi)
    {
        if (isVi)
        {
            sb.AppendLine($"Hãy tạo {count} câu hỏi tự luận ngắn (Short Answer) từ tài liệu.");
            sb.AppendLine("Mỗi câu hỏi phải có:");
            sb.AppendLine("- 1 câu hỏi mở");
            sb.AppendLine("- Đáp án mẫu chi tiết");
            sb.AppendLine("- Các ý chính cần có trong câu trả lời");
            if (!string.IsNullOrEmpty(difficulty))
                sb.AppendLine($"- Độ khó: {difficulty}");
        }
        else
        {
            sb.AppendLine($"Create {count} Short Answer questions from the document.");
            sb.AppendLine("Each question must have:");
            sb.AppendLine("- 1 open-ended question");
            sb.AppendLine("- Detailed sample answer");
            sb.AppendLine("- Key points that should be in the answer");
            if (!string.IsNullOrEmpty(difficulty))
                sb.AppendLine($"- Difficulty: {difficulty}");
        }
    }

    private void AppendFillInBlankInstructions(StringBuilder sb, int count, string? difficulty, bool isVi)
    {
        if (isVi)
        {
            sb.AppendLine($"Hãy tạo {count} câu hỏi điền vào chỗ trống (Fill in the Blank) từ tài liệu.");
            sb.AppendLine("Mỗi câu hỏi phải có:");
            sb.AppendLine("- 1 câu với chỗ trống (sử dụng _____ hoặc [blank])");
            sb.AppendLine("- Đáp án chính xác cho chỗ trống");
            sb.AppendLine("- Giải thích ngắn gọn");
            if (!string.IsNullOrEmpty(difficulty))
                sb.AppendLine($"- Độ khó: {difficulty}");
        }
        else
        {
            sb.AppendLine($"Create {count} Fill in the Blank questions from the document.");
            sb.AppendLine("Each question must have:");
            sb.AppendLine("- 1 sentence with a blank (use _____ or [blank])");
            sb.AppendLine("- Correct answer for the blank");
            sb.AppendLine("- Brief explanation");
            if (!string.IsNullOrEmpty(difficulty))
                sb.AppendLine($"- Difficulty: {difficulty}");
        }
    }

    private void AppendMixedInstructions(StringBuilder sb, int count, string? difficulty, bool isVi)
    {
        if (isVi)
        {
            sb.AppendLine($"Hãy tạo tổng cộng {count} câu hỏi MIX nhiều loại từ tài liệu.");
            sb.AppendLine("Bao gồm:");
            sb.AppendLine("- Trắc nghiệm (Multiple Choice)");
            sb.AppendLine("- Đúng/Sai (True/False)");
            sb.AppendLine("- Tự luận ngắn (Short Answer)");
            sb.AppendLine("Phân bổ đều các loại câu hỏi.");
            if (!string.IsNullOrEmpty(difficulty))
                sb.AppendLine($"- Độ khó: {difficulty}");
        }
        else
        {
            sb.AppendLine($"Create a total of {count} MIXED type questions from the document.");
            sb.AppendLine("Include:");
            sb.AppendLine("- Multiple Choice");
            sb.AppendLine("- True/False");
            sb.AppendLine("- Short Answer");
            sb.AppendLine("Distribute question types evenly.");
            if (!string.IsNullOrEmpty(difficulty))
                sb.AppendLine($"- Difficulty: {difficulty}");
        }
    }

    private void AppendJsonFormatInstructions(StringBuilder sb, bool isVi)
    {
        if (isVi)
        {
            sb.AppendLine("Trả về kết quả dưới dạng JSON với cấu trúc:");
        }
        else
        {
            sb.AppendLine("Return the result as JSON with the following structure:");
        }

        sb.AppendLine(@"{
  ""questions"": [
    {
      ""questionText"": ""Câu hỏi ở đây"",
      ""questionType"": ""MultipleChoice"",
      ""difficultyLevel"": ""Easy"",
      ""explanationText"": ""Giải thích"",
      ""topic"": ""Chủ đề"",
      ""options"": [
        { ""optionText"": ""Đáp án A"", ""isCorrect"": false },
        { ""optionText"": ""Đáp án B"", ""isCorrect"": true },
        { ""optionText"": ""Đáp án C"", ""isCorrect"": false },
        { ""optionText"": ""Đáp án D"", ""isCorrect"": false }
      ]
    }
  ]
}");

        sb.AppendLine();
        if (isVi)
        {
            sb.AppendLine("LƯU Ý:");
            sb.AppendLine("- CHỈ trả về JSON, KHÔNG có text giải thích thêm");
            sb.AppendLine("- questionType phải là: MultipleChoice, TrueFalse, ShortAnswer, hoặc FillInBlank");
            sb.AppendLine("- Với TrueFalse, chỉ có 2 options");
            sb.AppendLine("- Với ShortAnswer và FillInBlank, có thể có 1 hoặc nhiều options là đáp án mẫu");
        }
        else
        {
            sb.AppendLine("IMPORTANT:");
            sb.AppendLine("- ONLY return JSON, NO additional text or explanation");
            sb.AppendLine("- questionType must be: MultipleChoice, TrueFalse, ShortAnswer, or FillInBlank");
            sb.AppendLine("- For TrueFalse, only 2 options");
            sb.AppendLine("- For ShortAnswer and FillInBlank, can have 1 or more options as sample answers");
        }
    }

    private string TruncateText(string text, int maxLength)
    {
        if (text.Length <= maxLength)
            return text;

        return text[..maxLength] + "\n\n[... Text truncated due to length ...]";
    }

    // Response model for deserialization
    private class AIQuestionGeneratorResponse
    {
        public List<GeneratedQuestionDto> Questions { get; set; } = new();
    }
}
