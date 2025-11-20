import { CheckCircle, AlertCircle, Flag } from 'lucide-react';

interface QuizOption {
    id: string;
    label: string;
    content: string;
    image?: string;
}

interface QuizQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  image?: string;
  options: QuizOption[];
  selectedAnswer?: string;
  correctAnswer?: string;
  explanation?: string;
  isSubmitted: boolean;
  isFlagged: boolean;
  onSelectAnswer: (optionId: string) => void;
  onToggleFlag: () => void;
  renderMath: (text: string) => string;
  fontSize: number;
  isDarkMode: boolean;
  imageSize: number;
}export function QuizQuestion({
    questionNumber,
    totalQuestions,
    question,
    image,
    options,
    selectedAnswer,
    correctAnswer,
    explanation,
    isSubmitted,
    isFlagged,
    onSelectAnswer,
    onToggleFlag,
    renderMath,
    fontSize,
    isDarkMode,
    imageSize,
}: QuizQuestionProps) {
    const questionStatus = isSubmitted
        ? selectedAnswer === correctAnswer
            ? 'correct'
            : selectedAnswer
            ? 'incorrect'
            : 'unanswered'
        : 'unanswered';

    return (
        <div className={`rounded-xl shadow-sm border p-6 ${
            isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
        }`}>
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium font-open-sans ${
                        isDarkMode
                            ? 'bg-primary/20 text-blue-300'
                            : 'bg-primary/10 text-primary'
                    }`}>
                        Câu {questionNumber}/{totalQuestions}
                    </span>
                    {isFlagged && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium font-open-sans flex items-center gap-1 ${
                            isDarkMode
                                ? 'bg-yellow-900/30 text-yellow-300'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            <Flag className="w-4 h-4" />
                            Đã đánh dấu
                        </span>
                    )}
                    {isSubmitted && questionStatus === 'correct' && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium font-open-sans flex items-center gap-1 ${
                            isDarkMode
                                ? 'bg-green-900/30 text-green-300'
                                : 'bg-green-100 text-green-800'
                        }`}>
                            <CheckCircle className="w-4 h-4" />
                            Đúng
                        </span>
                    )}
                    {isSubmitted && questionStatus === 'incorrect' && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium font-open-sans flex items-center gap-1 ${
                            isDarkMode
                                ? 'bg-red-900/30 text-red-300'
                                : 'bg-red-100 text-red-800'
                        }`}>
                            <AlertCircle className="w-4 h-4" />
                            Sai
                        </span>
                    )}
                </div>
                <button
                    onClick={onToggleFlag}
                    className={`cursor-pointer p-2 rounded-lg transition-colors ${
                        isFlagged
                            ? isDarkMode
                                ? 'bg-yellow-900/30 text-yellow-300'
                                : 'bg-yellow-100 text-yellow-800'
                            : isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <Flag className="w-5 h-5" />
                </button>
            </div>

            {/* Question */}
            <div className="mb-6">
                <div
                    className={`leading-relaxed font-open-sans mb-4 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}
                    style={{ fontSize: `${fontSize}px` }}
                    dangerouslySetInnerHTML={{ __html: renderMath(question) }}
                />
                {image && (
                    <div className="mt-4 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img 
                            src={image} 
                            alt="Hình minh họa câu hỏi"
                            className="w-full h-auto object-contain bg-white"
                            style={{ maxHeight: `${384 * (imageSize / 100)}px` }}
                        />
                    </div>
                )}
            </div>

            {/* Options */}
            <div className="space-y-3">
                {options.map((option) => {
                    const isSelected = selectedAnswer === option.id;
                    const isCorrect = isSubmitted && option.id === correctAnswer;
                    const isWrong = isSubmitted && isSelected && option.id !== correctAnswer;

                    return (
                        <button
                            key={option.id}
                            onClick={() => onSelectAnswer(option.id)}
                            disabled={isSubmitted}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                isCorrect
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                    : isWrong
                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                    : isSelected
                                    ? isDarkMode
                                        ? 'border-primary bg-primary/10'
                                        : 'border-primary bg-primary/5'
                                    : isDarkMode
                                        ? 'border-gray-600 hover:border-primary/50 hover:bg-gray-700'
                                        : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                            } ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
                                        isCorrect
                                            ? 'bg-green-500 text-white'
                                            : isWrong
                                            ? 'bg-red-500 text-white'
                                            : isSelected
                                            ? 'bg-primary text-white'
                                            : isDarkMode
                                                ? 'bg-gray-700 text-gray-200'
                                                : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {option.label}
                                </div>
                                <div className="flex-1">
                                    <span
                                        className={`font-open-sans ${
                                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                        }`}
                                        style={{ fontSize: `${fontSize}px` }}
                                        dangerouslySetInnerHTML={{ __html: renderMath(option.content) }}
                                    />
                                    {option.image && (
                                        <div className="mt-2 rounded overflow-hidden border border-gray-300">
                                            <img 
                                                src={option.image} 
                                                alt={`Đáp án ${option.label}`}
                                                className="w-full h-auto object-contain bg-white"
                                                style={{ maxHeight: `${192 * (imageSize / 100)}px` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Explanation (After Submit) */}
            {isSubmitted && explanation && (
                <div className={`mt-6 p-4 border rounded-lg ${
                    isDarkMode
                        ? 'bg-blue-900/20 border-blue-700/30'
                        : 'bg-blue-50 border-blue-200'
                }`}>
                    <h4 className={`font-semibold mb-2 font-poppins flex items-center gap-2 ${
                        isDarkMode ? 'text-blue-300' : 'text-gray-900'
                    }`}>
                        <CheckCircle className={`w-5 h-5 ${
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        Giải thích
                    </h4>
                    <p
                        className={`font-open-sans ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                        style={{ fontSize: `${fontSize}px` }}
                        dangerouslySetInnerHTML={{ __html: renderMath(explanation) }}
                    />
                </div>
            )}
        </div>
    );
}
