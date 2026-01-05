import { X, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

export const ViewAttemptPanel = ({ isOpen, onClose, attempt }) => {
    if (!isOpen || !attempt) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getQuestionType = (type) => {
        return type === 0 ? 'Chọn 1 đáp án' : 'Chọn nhiều đáp án';
    };

    // Group answers by question
    const answersByQuestion = (attempt.answers || []).reduce((acc, answer) => {
        if (!acc[answer.questionId]) {
            acc[answer.questionId] = [];
        }
        acc[answer.questionId].push(answer);
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative bg-primary w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm shadow-lg mx-4">
                {/* Header */}
                <div className="sticky top-0 bg-primary border-b border-border px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-info-bg rounded-full flex items-center justify-center">
                            <User size={20} className="text-info" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Chi tiết bài làm
                            </h2>
                            <p className="text-sm text-foreground-light">
                                {attempt.student?.fullName || 'Học sinh'} - ID: {attempt.id}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Attempt Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-sm">
                        <div>
                            <div className="text-xs text-foreground-light mb-1">Thời gian bắt đầu</div>
                            <div className="text-sm text-foreground font-medium flex items-center gap-2">
                                <Clock size={14} />
                                {formatDate(attempt.startedAt)}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-foreground-light mb-1">Thời gian nộp bài</div>
                            <div className="text-sm text-foreground font-medium flex items-center gap-2">
                                {attempt.submittedAt ? (
                                    <>
                                        <CheckCircle size={14} className="text-success" />
                                        {formatDate(attempt.submittedAt)}
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle size={14} className="text-warning" />
                                        <span className="text-foreground-lighter italic">Chưa nộp</span>
                                    </>
                                )}
                            </div>
                        </div>
                        {attempt.score !== null && attempt.score !== undefined && (
                            <div className="col-span-2">
                                <div className="text-xs text-foreground-light mb-1">Điểm số</div>
                                <div className="text-2xl text-foreground font-bold">
                                    {attempt.score.toFixed(2)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Questions and Answers */}
                    <div>
                        <h3 className="text-base font-semibold text-foreground mb-4">
                            Câu trả lời của học sinh
                        </h3>

                        {attempt.quiz?.questions?.length > 0 ? (
                            <div className="space-y-6">
                                {attempt.quiz.questions.map((question, index) => {
                                    const studentAnswers = answersByQuestion[question.id] || [];
                                    const selectedOptionIds = studentAnswers.map(a => a.selectedOptionId);

                                    return (
                                        <div key={question.id} className="border border-border rounded-sm p-4">
                                            {/* Question Header */}
                                            <div className="mb-3">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-start gap-2">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-info-bg text-info rounded-full flex items-center justify-center text-xs font-semibold">
                                                            {index + 1}
                                                        </span>
                                                        <div>
                                                            <p className="text-foreground font-medium">{question.content}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-foreground-light rounded-sm">
                                                                    {getQuestionType(question.questionType)}
                                                                </span>
                                                                <span className="text-xs text-foreground-lighter">
                                                                    {question.points} điểm
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {question.explanation && (
                                                    <div className="ml-8 mt-2 p-2 bg-blue-50 border-l-2 border-info rounded-sm">
                                                        <p className="text-xs text-foreground-light">
                                                            <span className="font-semibold">Giải thích: </span>
                                                            {question.explanation}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Options */}
                                            <div className="ml-8 space-y-2">
                                                {question.options?.map((option) => {
                                                    const isSelected = selectedOptionIds.includes(option.id);
                                                    const isCorrect = option.isCorrect;

                                                    let bgColor = 'bg-white';
                                                    let borderColor = 'border-border';
                                                    let textColor = 'text-foreground';

                                                    if (isSelected && isCorrect) {
                                                        bgColor = 'bg-success-bg';
                                                        borderColor = 'border-success';
                                                        textColor = 'text-success';
                                                    } else if (isSelected && !isCorrect) {
                                                        bgColor = 'bg-red-50';
                                                        borderColor = 'border-red-300';
                                                        textColor = 'text-red-600';
                                                    } else if (!isSelected && isCorrect) {
                                                        bgColor = 'bg-green-50';
                                                        borderColor = 'border-green-200';
                                                        textColor = 'text-foreground-light';
                                                    }

                                                    return (
                                                        <div
                                                            key={option.id}
                                                            className={`p-3 border rounded-sm ${bgColor} ${borderColor}`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-info bg-info' : 'border-gray-300'}`}>
                                                                        {isSelected && (
                                                                            <CheckCircle size={12} className="text-white" />
                                                                        )}
                                                                    </div>
                                                                    <span className={`text-sm ${textColor}`}>
                                                                        {option.content}
                                                                    </span>
                                                                </div>
                                                                {isCorrect && (
                                                                    <span className="text-xs px-2 py-1 bg-success-bg text-success rounded-sm font-medium">
                                                                        Đáp án đúng
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Show if no answer */}
                                            {studentAnswers.length === 0 && (
                                                <div className="ml-8 p-3 bg-gray-50 border border-border rounded-sm">
                                                    <p className="text-sm text-foreground-lighter italic">
                                                        Học sinh chưa trả lời câu hỏi này
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-foreground-light">Không có câu hỏi nào</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-primary border-t border-border px-6 py-4 flex justify-end gap-3">
                    <Button onClick={onClose} variant="outline">
                        Đóng
                    </Button>
                </div>
            </div>
        </div>
    );
};
