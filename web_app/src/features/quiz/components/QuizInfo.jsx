import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../core/store/hooks';
import { updateQuizAsync } from '../store/quizSlice';
import { Calendar, Edit2, Save, X } from 'lucide-react';
import { Button, Input } from '../../../shared/components/ui';

export const QuizInfo = ({ quiz, onUpdate }) => {
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        timeLimitSec: 0,
        maxAttempts: 1,
        shuffleQuestions: false,
        shuffleOptions: false,
        gradingMethod: 'Automatic'
    });

    useEffect(() => {
        if (quiz) {
            setFormData({
                title: quiz.title || '',
                description: quiz.description || '',
                timeLimitSec: quiz.timeLimitSec || 0,
                maxAttempts: quiz.maxAttempts || 1,
                shuffleQuestions: quiz.shuffleQuestions || false,
                shuffleOptions: quiz.shuffleOptions || false,
                gradingMethod: quiz.gradingMethod || 'Automatic'
            });
        }
    }, [quiz]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await dispatch(updateQuizAsync({
                quizId: quiz.id,
                data: formData
            }));

            if (result.type.endsWith('/fulfilled')) {
                setIsEditing(false);
                if (onUpdate) onUpdate();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data
        setFormData({
            title: quiz.title || '',
            description: quiz.description || '',
            timeLimitSec: quiz.timeLimitSec || 0,
            maxAttempts: quiz.maxAttempts || 1,
            shuffleQuestions: quiz.shuffleQuestions || false,
            shuffleOptions: quiz.shuffleOptions || false,
            gradingMethod: quiz.gradingMethod || 'Automatic'
        });
    };

    if (!quiz) return null;

    return (
        <div className="space-y-6">
            {/* Header with Edit Button */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Thông tin bài kiểm tra</h2>
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Edit2 size={16} />
                        Chỉnh sửa
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button onClick={handleCancel} variant="outline" size="sm" disabled={loading}>
                            <X size={16} />
                            Hủy
                        </Button>
                        <Button onClick={handleSubmit} size="sm" disabled={loading}>
                            <Save size={16} />
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                    </div>
                )}
            </div>

            {/* Form / Display */}
            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-primary border border-border rounded-sm p-6">
                        <h3 className="text-base font-semibold text-foreground mb-4">Thông tin cơ bản</h3>
                        <div className="space-y-4">
                            <Input
                                label="Tiêu đề bài kiểm tra"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Nhập tiêu đề bài kiểm tra"
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Nhập mô tả bài kiểm tra (tùy chọn)"
                                    className="w-full px-3 py-2 border border-input-border rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm text-foreground bg-input min-h-[100px] resize-y"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-primary border border-border rounded-sm p-6">
                        <h3 className="text-base font-semibold text-foreground mb-4">Cài đặt</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="number"
                                label="Thời gian (giây)"
                                value={formData.timeLimitSec}
                                onChange={(e) => setFormData({ ...formData, timeLimitSec: parseInt(e.target.value) || 0 })}
                                min="0"
                                required
                            />

                            <Input
                                type="number"
                                label="Số lần thử tối đa"
                                value={formData.maxAttempts}
                                onChange={(e) => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) || 1 })}
                                min="1"
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Phương thức chấm điểm
                                </label>
                                <select
                                    value={formData.gradingMethod}
                                    onChange={(e) => setFormData({ ...formData, gradingMethod: e.target.value })}
                                    className="w-full px-3 py-2 border border-input-border rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm text-foreground bg-input"
                                >
                                    <option value="Automatic">Tự động</option>
                                    <option value="Manual">Thủ công</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.shuffleQuestions}
                                    onChange={(e) => setFormData({ ...formData, shuffleQuestions: e.target.checked })}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <span className="text-sm text-foreground">Xáo trộn câu hỏi</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.shuffleOptions}
                                    onChange={(e) => setFormData({ ...formData, shuffleOptions: e.target.checked })}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <span className="text-sm text-foreground">Xáo trộn đáp án</span>
                            </label>
                        </div>
                    </div>
                </form>
            ) : (
                <>
                    {/* Basic Info Display */}
                    <div className="bg-primary border border-border rounded-sm p-6">
                        <h3 className="text-base font-semibold text-foreground mb-4">Thông tin cơ bản</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-foreground-light mb-1">
                                    ID Bài kiểm tra
                                </label>
                                <p className="text-sm text-foreground">{quiz.id}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-foreground-light mb-1">
                                    Tiêu đề
                                </label>
                                <p className="text-sm text-foreground">{quiz.title}</p>
                            </div>

                            {quiz.description && (
                                <div>
                                    <label className="block text-xs font-medium text-foreground-light mb-1">
                                        Mô tả
                                    </label>
                                    <p className="text-sm text-foreground whitespace-pre-wrap">{quiz.description}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-foreground-light mb-1">
                                    Người tạo
                                </label>
                                <p className="text-sm text-foreground">{quiz.createdBy || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Settings Display */}
                    <div className="bg-primary border border-border rounded-sm p-6">
                        <h3 className="text-base font-semibold text-foreground mb-4">Cài đặt</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-foreground-light mb-1">
                                    Thời gian làm bài
                                </label>
                                <p className="text-sm text-foreground">
                                    {Math.floor(quiz.timeLimitSec / 60)} phút {quiz.timeLimitSec % 60} giây
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-foreground-light mb-1">
                                    Số lần thử
                                </label>
                                <p className="text-sm text-foreground">{quiz.maxAttempts}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-foreground-light mb-1">
                                    Phương thức chấm điểm
                                </label>
                                <p className="text-sm text-foreground">{quiz.gradingMethod}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-foreground-light mb-1">
                                    Số câu hỏi
                                </label>
                                <p className="text-sm text-foreground">{quiz.questions?.length || 0} câu</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-foreground-light">Xáo trộn câu hỏi</span>
                                <span className={`px-2 py-1 rounded-sm text-xs font-medium ${
                                    quiz.shuffleQuestions ? 'bg-success-bg text-success' : 'bg-gray-100 text-foreground-light'
                                }`}>
                                    {quiz.shuffleQuestions ? 'Có' : 'Không'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-foreground-light">Xáo trộn đáp án</span>
                                <span className={`px-2 py-1 rounded-sm text-xs font-medium ${
                                    quiz.shuffleOptions ? 'bg-success-bg text-success' : 'bg-gray-100 text-foreground-light'
                                }`}>
                                    {quiz.shuffleOptions ? 'Có' : 'Không'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="bg-primary border border-border rounded-sm p-6">
                        <h3 className="text-base font-semibold text-foreground mb-4">Thời gian</h3>
                        <div className="space-y-3">
                            {quiz.createdAt && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-foreground-light flex items-center gap-1">
                                        <Calendar size={14} />
                                        Ngày tạo:
                                    </span>
                                    <span className="text-foreground">
                                        {new Date(quiz.createdAt).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                            )}
                            {quiz.updatedAt && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-foreground-light flex items-center gap-1">
                                        <Calendar size={14} />
                                        Cập nhật:
                                    </span>
                                    <span className="text-foreground">
                                        {new Date(quiz.updatedAt).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
