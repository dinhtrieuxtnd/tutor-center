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
        sb.AppendLine(TruncateText(documentText, 30000));
        sb.AppendLine("=== END DOCUMENT ===");
        sb.AppendLine();

        // Instructions based on question type
        switch (questionType.ToLowerInvariant())
        {
            case "single_choice":
            case "singlechoice":
                AppendSingleChoiceInstructions(sb, count, difficultyLevel, isVietnamese);
                break;
            case "multiple_choice":
            case "multiplechoice":
                AppendMultipleChoiceInstructions(sb, count, difficultyLevel, isVietnamese);
                break;
            default:
                throw new ArgumentException($"Unsupported question type: {questionType}. Only 'single_choice' and 'multiple_choice' are supported.");
        }

        sb.AppendLine();
        AppendJsonFormatInstructions(sb, isVietnamese);

        return sb.ToString();
    }

    private void AppendSingleChoiceInstructions(StringBuilder sb, int count, string? difficulty, bool isVi)
    {
        if (isVi)
        {
            sb.AppendLine($"Hãy tạo {count} câu hỏi trắc nghiệm CHỌN 1 ĐÁP ÁN ĐÚNG (Single Choice) từ tài liệu.");
            sb.AppendLine("Mỗi câu hỏi phải có:");
            sb.AppendLine("- 1 câu hỏi rõ ràng, dễ hiểu");
            sb.AppendLine("- 4 đáp án (A, B, C, D)");
            sb.AppendLine("- CHỈ ĐÚNG 1 đáp án đúng duy nhất");
            sb.AppendLine("- 3 đáp án còn lại là sai");
            sb.AppendLine("- Giải thích ngắn gọn tại sao đáp án đó đúng");
            sb.AppendLine("- Chủ đề của câu hỏi");
            if (!string.IsNullOrEmpty(difficulty))
                sb.AppendLine($"- Độ khó: {difficulty}");
        }
        else
        {
            sb.AppendLine($"Create {count} Single Choice questions (ONLY ONE CORRECT ANSWER) from the document.");
            sb.AppendLine("Each question must have:");
            sb.AppendLine("- 1 clear, understandable question");
            sb.AppendLine("- 4 options (A, B, C, D)");
            sb.AppendLine("- EXACTLY 1 correct answer");
            sb.AppendLine("- 3 incorrect answers");
            sb.AppendLine("- Brief explanation why that answer is correct");
            sb.AppendLine("- Topic of the question");
            if (!string.IsNullOrEmpty(difficulty))
                sb.AppendLine($"- Difficulty: {difficulty}");
        }
    }

    private void AppendMultipleChoiceInstructions(StringBuilder sb, int count, string? difficulty, bool isVi)
    {
        if (isVi)
        {
            sb.AppendLine($"Hãy tạo {count} câu hỏi trắc nghiệm CHỌN NHIỀU ĐÁP ÁN ĐÚNG (Multiple Choice) từ tài liệu.");
            sb.AppendLine("Mỗi câu hỏi phải có:");
            sb.AppendLine("- 1 câu hỏi rõ ràng, dễ hiểu");
            sb.AppendLine("- 4 đáp án (A, B, C, D)");
            sb.AppendLine("- TỪ 2 ĐẾN 3 đáp án đúng (có thể 2 đúng, hoặc 3 đúng)");
            sb.AppendLine("- Ít nhất 1 đáp án sai");
            sb.AppendLine("- Giải thích ngắn gọn tại sao các đáp án đó đúng");
            sb.AppendLine("- Chủ đề của câu hỏi");
            if (!string.IsNullOrEmpty(difficulty))
                sb.AppendLine($"- Độ khó: {difficulty}");
        }
        else
        {
            sb.AppendLine($"Create {count} Multiple Choice questions (MULTIPLE CORRECT ANSWERS) from the document.");
            sb.AppendLine("Each question must have:");
            sb.AppendLine("- 1 clear, understandable question");
            sb.AppendLine("- 4 options (A, B, C, D)");
            sb.AppendLine("- FROM 2 TO 3 correct answers (can be 2 or 3 correct answers)");
            sb.AppendLine("- At least 1 incorrect answer");
            sb.AppendLine("- Brief explanation why those answers are correct");
            sb.AppendLine("- Topic of the question");
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
      ""questionType"": ""single_choice"",
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
            sb.AppendLine("LƯU Ý QUAN TRỌNG:");
            sb.AppendLine("- CHỈ trả về JSON, KHÔNG có text giải thích thêm, KHÔNG có markdown code blocks");
            sb.AppendLine("- questionType phải là: \"single_choice\" (1 đáp án đúng) hoặc \"multiple_choice\" (2-3 đáp án đúng)");
            sb.AppendLine("- Với single_choice: CHỈ có ĐÚNG 1 option có isCorrect = true");
            sb.AppendLine("- Với multiple_choice: phải có TỪ 2 ĐẾN 3 options có isCorrect = true");
            sb.AppendLine("- Mỗi câu hỏi PHẢI có đủ 4 options");
            sb.AppendLine("- KHÔNG sử dụng ký tự escape không hợp lệ như backslash-s trong JSON");
        }
        else
        {
            sb.AppendLine("IMPORTANT NOTES:");
            sb.AppendLine("- ONLY return JSON, NO additional text or explanation, NO markdown code blocks");
            sb.AppendLine("- questionType must be: \"single_choice\" (1 correct answer) or \"multiple_choice\" (2-3 correct answers)");
            sb.AppendLine("- For single_choice: EXACTLY 1 option with isCorrect = true");
            sb.AppendLine("- For multiple_choice: FROM 2 TO 3 options with isCorrect = true");
            sb.AppendLine("- Each question MUST have exactly 4 options");
            sb.AppendLine("- DO NOT use invalid escape characters in JSON");
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
