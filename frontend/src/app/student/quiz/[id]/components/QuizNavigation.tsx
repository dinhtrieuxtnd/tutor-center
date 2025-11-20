import { ChevronLeft, ChevronRight, List } from 'lucide-react';

interface QuizNavigationProps {
    currentQuestion: number;
    totalQuestions: number;
    onPrevious: () => void;
    onNext: () => void;
    onToggleList: () => void;
    isDarkMode: boolean;
}

export function QuizNavigation({
    currentQuestion,
    totalQuestions,
    onPrevious,
    onNext,
    onToggleList,
    isDarkMode,
}: QuizNavigationProps) {
    return (
        <div className={`mt-6 flex items-center justify-between pt-6 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
            <button
                onClick={onPrevious}
                disabled={currentQuestion === 0}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-open-sans ${
                    isDarkMode
                        ? 'border-gray-600 text-gray-200 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
                <ChevronLeft className="w-4 h-4" />
                Câu trước
            </button>

            <button
                onClick={onToggleList}
                className={`cursor-pointer md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors font-open-sans ${
                    isDarkMode
                        ? 'border-gray-600 text-gray-200 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
                <List className="w-4 h-4" />
                Danh sách câu hỏi
            </button>

            <button
                onClick={onNext}
                disabled={currentQuestion === totalQuestions - 1}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-open-sans ${
                    isDarkMode
                        ? 'border-gray-600 text-gray-200 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
                Câu sau
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
