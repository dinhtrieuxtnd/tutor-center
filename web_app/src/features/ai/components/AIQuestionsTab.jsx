import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import {
    generateQuestionsAsync,
    getJobStatusAsync,
    getQuestionsByDocumentAsync,
    updateQuestionAsync,
    deleteQuestionAsync,
    importQuestionsAsync,
    clearCurrentQuestion,
} from '../store/aiQuestionSlice';
import { getAllDocumentsAsync } from '../store/aiDocumentSlice';
import { getAllQuizzesAsync } from '../../quiz/store/quizSlice';
import { Sparkles, RefreshCw, Edit2, Trash2, CheckCircle, X, FileQuestion, Upload } from 'lucide-react';
import { Spinner } from '../../../shared/components/loading/Loading';
import { Button } from '../../../shared/components';
import { ConfirmModal } from '../../../shared/components';

export const AIQuestionsTab = ({ classroomId }) => {
    const dispatch = useAppDispatch();
    const {
        questions,
        currentJob,
        loading,
        generateLoading,
        updateLoading,
        deleteLoading,
        importLoading,
    } = useAppSelector((state) => state.aiQuestion);
    const { documents } = useAppSelector((state) => state.aiDocument);
    const { quizzes } = useAppSelector((state) => state.quiz);

    // Generate form state
    const [selectedDocumentId, setSelectedDocumentId] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState(10);
    const [difficultyLevel, setDifficultyLevel] = useState('Medium');
    const [questionTypes, setQuestionTypes] = useState(['MultipleChoice']);

    // Job tracking
    const [jobPollingInterval, setJobPollingInterval] = useState(null);

    // Questions management
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [editFormData, setEditFormData] = useState(null);

    // Import state
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState('');

    // Delete state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

    useEffect(() => {
        if (classroomId) {
            dispatch(getAllDocumentsAsync({ classroomId }));
            dispatch(getAllQuizzesAsync({ classroomId }));
        }
    }, [classroomId, dispatch]);

    // Poll job status
    useEffect(() => {
        if (currentJob && (currentJob.status === 'Pending' || currentJob.status === 'Processing')) {
            const interval = setInterval(() => {
                dispatch(getJobStatusAsync(currentJob.jobId));
            }, 3000);
            setJobPollingInterval(interval);

            return () => {
                if (interval) clearInterval(interval);
            };
        } else {
            if (jobPollingInterval) {
                clearInterval(jobPollingInterval);
                setJobPollingInterval(null);
            }
            // If job completed, load questions
            if (currentJob && currentJob.status === 'Completed' && currentJob.documentId) {
                dispatch(getQuestionsByDocumentAsync(currentJob.documentId));
            }
        }
    }, [currentJob, dispatch]);

    const handleGenerate = async () => {
        if (!selectedDocumentId) return;

        const data = {
            documentId: parseInt(selectedDocumentId),
            numberOfQuestions,
            difficultyLevel,
            questionTypes,
        };

        await dispatch(generateQuestionsAsync(data));
    };

    const handleLoadQuestions = () => {
        if (selectedDocumentId) {
            dispatch(getQuestionsByDocumentAsync(parseInt(selectedDocumentId)));
        }
    };

    const handleEditClick = (question) => {
        setEditingQuestion(question);
        setEditFormData({
            questionText: question.questionText,
            explanation: question.explanation || '',
            options: question.options ? [...question.options] : [],
        });
    };

    const handleEditSave = async () => {
        if (!editingQuestion || !editFormData) return;

        const result = await dispatch(
            updateQuestionAsync({
                questionId: editingQuestion.id,
                data: editFormData,
            })
        );

        if (result.type.endsWith('/fulfilled')) {
            setEditingQuestion(null);
            setEditFormData(null);
        }
    };

    const handleDeleteClick = (question) => {
        setQuestionToDelete(question);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!questionToDelete) return;

        const result = await dispatch(deleteQuestionAsync(questionToDelete.id));
        if (result.type.endsWith('/fulfilled')) {
            setDeleteModalOpen(false);
            setQuestionToDelete(null);
            setSelectedQuestions(selectedQuestions.filter((id) => id !== questionToDelete.id));
            // Reload questions
            if (selectedDocumentId) {
                dispatch(getQuestionsByDocumentAsync(parseInt(selectedDocumentId)));
            }
        }
    };

    const handleSelectQuestion = (questionId) => {
        setSelectedQuestions((prev) =>
            prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
        );
    };

    const handleSelectAll = () => {
        if (selectedQuestions.length === questions.length) {
            setSelectedQuestions([]);
        } else {
            setSelectedQuestions(questions.map((q) => q.id));
        }
    };

    const handleImportClick = () => {
        if (selectedQuestions.length === 0) return;
        setImportModalOpen(true);
    };

    const handleImportConfirm = async () => {
        if (!selectedQuizId || selectedQuestions.length === 0) return;

        const data = {
            quizId: parseInt(selectedQuizId),
            generatedQuestionIds: selectedQuestions,
        };

        const result = await dispatch(importQuestionsAsync(data));
        if (result.type.endsWith('/fulfilled')) {
            setImportModalOpen(false);
            setSelectedQuizId('');
            setSelectedQuestions([]);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            Pending: { label: 'Đang chờ', color: 'bg-gray-100 text-gray-700' },
            Processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700' },
            Completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700' },
            Failed: { label: 'Thất bại', color: 'bg-red-100 text-red-700' },
        };

        const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' };

        return (
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-sm ${statusInfo.color}`}>
                {statusInfo.label}
            </span>
        );
    };

    const getDifficultyBadge = (difficulty) => {
        const difficultyMap = {
            Easy: { label: 'Dễ', color: 'bg-green-100 text-green-700' },
            Medium: { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-700' },
            Hard: { label: 'Khó', color: 'bg-red-100 text-red-700' },
        };

        const difficultyInfo = difficultyMap[difficulty] || { label: difficulty, color: 'bg-gray-100 text-gray-700' };

        return (
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-sm ${difficultyInfo.color}`}>
                {difficultyInfo.label}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Step 1: Generate Questions */}
            <div className="bg-primary border border-border rounded-sm p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Sinh câu hỏi từ tài liệu</h3>
                    <p className="text-sm text-foreground-light">
                        Sử dụng AI để tự động tạo câu hỏi từ nội dung tài liệu
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Chọn tài liệu <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedDocumentId}
                            onChange={(e) => setSelectedDocumentId(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-sm bg-secondary text-foreground"
                        >
                            <option value="">-- Chọn tài liệu --</option>
                            {documents
                                .filter((doc) => doc.status === 'Extracted')
                                .map((doc) => (
                                    <option key={doc.id} value={doc.id}>
                                        {doc.fileName}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Số câu hỏi
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={numberOfQuestions}
                            onChange={(e) => setNumberOfQuestions(parseInt(e.target.value) || 10)}
                            className="w-full px-3 py-2 border border-border rounded-sm bg-secondary text-foreground"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Độ khó
                        </label>
                        <select
                            value={difficultyLevel}
                            onChange={(e) => setDifficultyLevel(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-sm bg-secondary text-foreground"
                        >
                            <option value="Easy">Dễ</option>
                            <option value="Medium">Trung bình</option>
                            <option value="Hard">Khó</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Loại câu hỏi
                        </label>
                        <select
                            value={questionTypes[0]}
                            onChange={(e) => setQuestionTypes([e.target.value])}
                            className="w-full px-3 py-2 border border-border rounded-sm bg-secondary text-foreground"
                        >
                            <option value="MultipleChoice">Trắc nghiệm</option>
                            <option value="TrueFalse">Đúng/Sai</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleGenerate}
                        disabled={!selectedDocumentId || generateLoading}
                        className="gap-2"
                    >
                        {generateLoading ? (
                            <>
                                <Spinner size="sm" />
                                Đang gửi yêu cầu...
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                Sinh câu hỏi
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={handleLoadQuestions}
                        disabled={!selectedDocumentId || loading}
                        variant="outline"
                        className="gap-2"
                    >
                        <RefreshCw size={16} />
                        Tải câu hỏi
                    </Button>
                </div>
            </div>

            {/* Step 2: Job Status */}
            {currentJob && (
                <div className="bg-primary border border-border rounded-sm p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Trạng thái công việc AI</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {(currentJob.status === 'Pending' || currentJob.status === 'Processing') && (
                                <Spinner size="md" />
                            )}
                            <div>
                                <p className="text-sm font-medium text-foreground">Job ID: {currentJob.jobId}</p>
                                <p className="text-xs text-foreground-light mt-1">
                                    {currentJob.status === 'Processing' && 'AI đang phân tích và tạo câu hỏi...'}
                                    {currentJob.status === 'Pending' && 'Đang chờ xử lý...'}
                                    {currentJob.status === 'Completed' && 'Đã hoàn thành! Tải câu hỏi để xem kết quả.'}
                                    {currentJob.status === 'Failed' && 'Xử lý thất bại. Vui lòng thử lại.'}
                                </p>
                            </div>
                        </div>
                        {getStatusBadge(currentJob.status)}
                    </div>
                </div>
            )}

            {/* Step 3: Review & Edit Questions */}
            {questions.length > 0 && (
                <div className="bg-primary border border-border rounded-sm overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Danh sách câu hỏi AI</h3>
                            <p className="text-sm text-foreground-light mt-1">
                                {selectedQuestions.length} / {questions.length} câu được chọn
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={handleSelectAll} variant="outline" size="sm">
                                {selectedQuestions.length === questions.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                            </Button>
                            <Button
                                onClick={handleImportClick}
                                disabled={selectedQuestions.length === 0 || importLoading}
                                className="gap-2"
                                size="sm"
                            >
                                <Upload size={16} />
                                Nhập vào Quiz ({selectedQuestions.length})
                            </Button>
                        </div>
                    </div>

                    <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                        {questions.map((question, index) => (
                            <div
                                key={question.id}
                                className={`p-4 hover:bg-secondary/50 transition-colors ${
                                    selectedQuestions.includes(question.id) ? 'bg-blue-50' : ''
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedQuestions.includes(question.id)}
                                        onChange={() => handleSelectQuestion(question.id)}
                                        className="mt-1 w-4 h-4 rounded border-gray-300"
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-foreground-light">
                                                    Câu {index + 1}
                                                </span>
                                                {getDifficultyBadge(question.difficultyLevel)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(question)}
                                                    className="text-foreground-light hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-sm"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(question)}
                                                    disabled={deleteLoading}
                                                    className="text-red-600 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-sm disabled:opacity-50"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-sm text-foreground mb-3">{question.questionText}</p>

                                        {question.options && question.options.length > 0 && (
                                            <div className="space-y-2 mb-3">
                                                {question.options.map((option, optIndex) => (
                                                    <div
                                                        key={optIndex}
                                                        className={`flex items-center gap-2 text-sm p-2 rounded-sm ${
                                                            option.isCorrect
                                                                ? 'bg-green-50 border border-green-200'
                                                                : 'bg-secondary'
                                                        }`}
                                                    >
                                                        {option.isCorrect && (
                                                            <CheckCircle size={14} className="text-green-600" />
                                                        )}
                                                        <span className="font-medium text-foreground-light">
                                                            {String.fromCharCode(65 + optIndex)}.
                                                        </span>
                                                        <span className="text-foreground">{option.optionText}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {question.explanation && (
                                            <div className="bg-secondary p-3 rounded-sm">
                                                <p className="text-xs font-medium text-foreground-light mb-1">
                                                    Giải thích:
                                                </p>
                                                <p className="text-sm text-foreground">{question.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No questions */}
            {!loading && questions.length === 0 && (
                <div className="bg-primary border border-border rounded-sm p-12 text-center">
                    <FileQuestion size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-foreground-light">Chưa có câu hỏi nào</p>
                    <p className="text-xs text-foreground-light mt-1">
                        Chọn tài liệu và sinh câu hỏi bằng AI
                    </p>
                </div>
            )}

            {/* Edit Question Modal */}
            {editingQuestion && editFormData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-primary border border-border rounded-sm shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="text-lg font-semibold text-foreground">Chỉnh sửa câu hỏi</h3>
                            <button
                                onClick={() => {
                                    setEditingQuestion(null);
                                    setEditFormData(null);
                                }}
                                className="text-foreground-light hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Nội dung câu hỏi
                                </label>
                                <textarea
                                    value={editFormData.questionText}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, questionText: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-3 py-2 border border-border rounded-sm bg-secondary text-foreground"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Giải thích
                                </label>
                                <textarea
                                    value={editFormData.explanation}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, explanation: e.target.value })
                                    }
                                    rows={2}
                                    className="w-full px-3 py-2 border border-border rounded-sm bg-secondary text-foreground"
                                />
                            </div>

                            {editFormData.options && editFormData.options.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Đáp án
                                    </label>
                                    <div className="space-y-2">
                                        {editFormData.options.map((option, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={option.isCorrect}
                                                    onChange={(e) => {
                                                        const newOptions = [...editFormData.options];
                                                        newOptions[index].isCorrect = e.target.checked;
                                                        setEditFormData({ ...editFormData, options: newOptions });
                                                    }}
                                                    className="w-4 h-4 rounded border-gray-300"
                                                />
                                                <input
                                                    type="text"
                                                    value={option.optionText}
                                                    onChange={(e) => {
                                                        const newOptions = [...editFormData.options];
                                                        newOptions[index].optionText = e.target.value;
                                                        setEditFormData({ ...editFormData, options: newOptions });
                                                    }}
                                                    className="flex-1 px-3 py-2 border border-border rounded-sm bg-secondary text-foreground"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-border flex justify-end gap-2">
                            <Button
                                onClick={() => {
                                    setEditingQuestion(null);
                                    setEditFormData(null);
                                }}
                                variant="outline"
                            >
                                Hủy
                            </Button>
                            <Button onClick={handleEditSave} disabled={updateLoading}>
                                {updateLoading ? (
                                    <>
                                        <Spinner size="sm" />
                                        Đang lưu...
                                    </>
                                ) : (
                                    'Lưu thay đổi'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {importModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-primary border border-border rounded-sm shadow-xl max-w-md w-full">
                        <div className="p-4 border-b border-border">
                            <h3 className="text-lg font-semibold text-foreground">Nhập câu hỏi vào Quiz</h3>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-foreground-light mb-4">
                                Chọn Quiz để nhập {selectedQuestions.length} câu hỏi đã chọn
                            </p>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Chọn Quiz <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedQuizId}
                                    onChange={(e) => setSelectedQuizId(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-sm bg-secondary text-foreground"
                                >
                                    <option value="">-- Chọn Quiz --</option>
                                    {quizzes
                                        .filter((quiz) => quiz.classroomId === classroomId)
                                        .map((quiz) => (
                                            <option key={quiz.id} value={quiz.id}>
                                                {quiz.title}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="p-4 border-t border-border flex justify-end gap-2">
                            <Button
                                onClick={() => {
                                    setImportModalOpen(false);
                                    setSelectedQuizId('');
                                }}
                                variant="outline"
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleImportConfirm}
                                disabled={!selectedQuizId || importLoading}
                            >
                                {importLoading ? (
                                    <>
                                        <Spinner size="sm" />
                                        Đang nhập...
                                    </>
                                ) : (
                                    'Nhập vào Quiz'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setQuestionToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Xác nhận xóa câu hỏi"
                message="Bạn có chắc chắn muốn xóa câu hỏi này?"
                confirmText="Xóa"
                cancelText="Hủy"
                isLoading={deleteLoading}
            />
        </div>
    );
};
