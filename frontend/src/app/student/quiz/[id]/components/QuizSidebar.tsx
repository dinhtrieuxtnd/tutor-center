import { Flag } from 'lucide-react';

interface QuizQuestion {
    id: number;
    question: string;
    options: any[];
    correctAnswer?: string;
    explanation?: string;
}

interface QuestionGroup {
    id: number;
    context: string;
    questions: QuizQuestion[];
}

interface QuizSection {
    id: number;
    title: string;
    description?: string;
    questionGroups: QuestionGroup[];
    questions: QuizQuestion[];
}

interface QuizSidebarProps {
    sections: QuizSection[];
    currentQuestion: number;
    answers: Record<number, string>;
    flaggedQuestions: Set<number>;
    isSubmitted: boolean;
    correctAnswers?: string[];
    score?: string;
    maxScore: number;
    onSelectQuestion: (index: number) => void;
    showOnMobile: boolean;
    isDarkMode: boolean;
}

export function QuizSidebar({
    sections,
    currentQuestion,
    answers,
    flaggedQuestions,
    isSubmitted,
    correctAnswers,
    score,
    maxScore,
    onSelectQuestion,
    showOnMobile,
    isDarkMode,
}: QuizSidebarProps) {
    // Helper: Get all questions in a section
    const getAllQuestionsInSection = (section: QuizSection): QuizQuestion[] => {
        const questions: QuizQuestion[] = [];
        questions.push(...section.questions);
        section.questionGroups.forEach(group => {
            questions.push(...group.questions);
        });
        return questions;
    };

    // Helper: Get total questions
    const getTotalQuestions = () => {
        return sections.reduce((total, section) => {
            return total + getAllQuestionsInSection(section).length;
        }, 0);
    };

    const getQuestionStatus = (index: number) => {
        if (isSubmitted && correctAnswers) {
            const answer = answers[index];
            const correct = correctAnswers[index];
            if (answer === correct) return 'correct';
            if (answer) return 'incorrect';
            return 'unanswered';
        }
        if (answers[index]) return 'answered';
        return 'unanswered';
    };

    return (
        <div className={`lg:col-span-1 ${showOnMobile ? 'block' : 'hidden lg:block'}`}>
            <div className={`rounded-xl shadow-sm border p-6 sticky top-6 ${
                isDarkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
            }`}>
                <h3 className={`font-bold mb-4 font-poppins ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>Danh sách câu hỏi</h3>

                {/* Legend */}
                <div className="mb-4 space-y-2 text-xs font-open-sans">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-primary rounded"></div>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Đã trả lời</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${
                            isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                        }`}></div>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Chưa trả lời</span>
                    </div>
                    {isSubmitted && (
                        <>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded"></div>
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Đúng</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 rounded"></div>
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Sai</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Question Grid by Sections */}
                <div className="space-y-4">
                    {sections.map((section, sectionIndex) => {
                        const sectionQuestions = getAllQuestionsInSection(section);
                        const startIndex = sections
                            .slice(0, sectionIndex)
                            .reduce((sum, s) => sum + getAllQuestionsInSection(s).length, 0);

                        return (
                            <div key={section.id}>
                                <h4 className={`text-xs font-semibold mb-2 font-poppins uppercase tracking-wide ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    {section.title}
                                </h4>
                                <div className="grid grid-cols-5 gap-2">
                                    {sectionQuestions.map((_, questionIndex) => {
                                        const globalIndex = startIndex + questionIndex;
                                        const status = getQuestionStatus(globalIndex);
                                        const isFlagged = flaggedQuestions.has(globalIndex);
                                        const isCurrent = currentQuestion === globalIndex;

                                        return (
                                            <button
                                                key={globalIndex}
                                                onClick={() => onSelectQuestion(globalIndex)}
                                                className={`cursor-pointer aspect-square rounded-lg font-semibold text-sm transition-all relative ${
                                                    isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''
                                                } ${
                                                    status === 'correct'
                                                        ? 'bg-green-500 text-white'
                                                        : status === 'incorrect'
                                                        ? 'bg-red-500 text-white'
                                                        : status === 'answered'
                                                        ? 'bg-primary text-white'
                                                        : isDarkMode
                                                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                {globalIndex + 1}
                                                {isFlagged && (
                                                    <Flag className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500 fill-yellow-500" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Stats */}
                <div className={`mt-6 pt-6 border-t space-y-2 text-sm font-open-sans ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Đã trả lời:</span>
                        <span className={`font-semibold ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            {Object.keys(answers).length}/{getTotalQuestions()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Đánh dấu:</span>
                        <span className={`font-semibold ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>{flaggedQuestions.size}</span>
                    </div>
                    {isSubmitted && score && (
                        <div className={`flex justify-between pt-2 border-t ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Điểm số:</span>
                            <span className="font-bold text-primary">
                                {score}/{maxScore}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
