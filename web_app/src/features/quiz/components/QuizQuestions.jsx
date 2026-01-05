import { CheckCircle, FileQuestion } from 'lucide-react';

export const QuizQuestions = ({ quiz }) => {
    if (!quiz) return null;

    const questions = quiz.questions || [];

    if (questions.length === 0) {
        return (
            <div className="bg-primary border border-border rounded-sm p-12">
                <div className="text-center">
                    <FileQuestion size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-foreground-light">Chưa có câu hỏi nào</p>
                    <p className="text-xs text-foreground-lighter mt-1">
                        Câu hỏi sẽ được quản lý qua API riêng
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                    Danh sách câu hỏi ({questions.length})
                </h2>
            </div>

            <div className="space-y-4">
                {questions.map((question, qIdx) => (
                    <div key={question.id || qIdx} className="bg-primary border border-border rounded-sm p-6">
                        {/* Question Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="flex-shrink-0 w-8 h-8 bg-info-bg text-info rounded-full flex items-center justify-center text-sm font-semibold">
                                    {qIdx + 1}
                                </span>
                                <span className="text-sm font-semibold text-foreground">
                                    Câu hỏi {qIdx + 1}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-foreground-light bg-gray-100 px-2 py-1 rounded-sm border border-border">
                                    {question.questionType || 'MultipleChoice'}
                                </span>
                                <span className="text-xs font-medium text-foreground bg-success-bg px-2 py-1 rounded-sm border border-success">
                                    {question.points || 1} điểm
                                </span>
                            </div>
                        </div>

                        {/* Question Content */}
                        <div className="mb-4 pl-11">
                            <p className="text-sm text-foreground whitespace-pre-wrap">
                                {question.content}
                            </p>
                        </div>

                        {/* Options */}
                        {question.options && question.options.length > 0 && (
                            <div className="pl-11 space-y-2">
                                <p className="text-xs font-medium text-foreground-light mb-2">Các đáp án:</p>
                                {question.options.map((option, oIdx) => (
                                    <div
                                        key={option.id || oIdx}
                                        className={`flex items-start gap-3 p-3 rounded-sm text-sm transition-colors ${
                                            option.isCorrect
                                                ? 'bg-success-bg border border-success'
                                                : 'bg-gray-50 border border-border hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex-shrink-0 mt-0.5">
                                            {option.isCorrect ? (
                                                <CheckCircle size={18} className="text-success" />
                                            ) : (
                                                <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <span className={option.isCorrect ? 'text-success font-medium' : 'text-foreground'}>
                                                {option.content}
                                            </span>
                                            {option.isCorrect && (
                                                <span className="ml-2 text-xs text-success">(Đáp án đúng)</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* No Options Message */}
                        {(!question.options || question.options.length === 0) && (
                            <div className="pl-11 py-3">
                                <p className="text-xs text-foreground-lighter italic">Không có đáp án</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
