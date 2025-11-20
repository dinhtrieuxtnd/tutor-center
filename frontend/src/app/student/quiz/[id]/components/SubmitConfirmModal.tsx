interface SubmitConfirmModalProps {
    show: boolean;
    answeredCount: number;
    totalQuestions: number;
    onConfirm: () => void;
    onCancel: () => void;
    isDarkMode: boolean;
}

export function SubmitConfirmModal({
    show,
    answeredCount,
    totalQuestions,
    onConfirm,
    onCancel,
    isDarkMode,
}: SubmitConfirmModalProps) {
    if (!show) return null;

    const unansweredCount = totalQuestions - answeredCount;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-xl shadow-xl max-w-md w-full p-6 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
                <h3 className={`text-xl font-bold mb-4 font-poppins ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                    Xác nhận nộp bài
                </h3>
                <p className={`mb-2 font-open-sans ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                    Bạn đã trả lời{' '}
                    <strong>
                        {answeredCount}/{totalQuestions}
                    </strong>{' '}
                    câu hỏi.
                </p>
                {unansweredCount > 0 && (
                    <p className={`mb-4 font-open-sans ${
                        isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
                    }`}>
                        ⚠️ Còn <strong>{unansweredCount}</strong> câu chưa trả lời!
                    </p>
                )}
                <p className={`mb-6 font-open-sans ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                    Sau khi nộp bài, bạn không thể thay đổi câu trả lời. Bạn có chắc chắn muốn nộp
                    bài?
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className={`cursor-pointer flex-1 px-4 py-2 border rounded-lg transition-colors font-open-sans ${
                            isDarkMode
                                ? 'border-gray-600 text-gray-200 hover:bg-gray-700'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="cursor-pointer flex-1 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-open-sans"
                    >
                        Nộp bài
                    </button>
                </div>
            </div>
        </div>
    );
}
