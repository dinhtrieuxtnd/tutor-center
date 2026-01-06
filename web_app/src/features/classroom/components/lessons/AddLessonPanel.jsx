import { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Input, Checkbox, DateTimePicker, Dropdown } from '../../../../shared/components/ui';

export const AddLessonPanel = ({ isOpen, onClose, onSubmit, isLoading, classroomId }) => {
    const [lessonType, setLessonType] = useState('lecture'); // lecture, exercise, quiz
    const [formData, setFormData] = useState({
        lectureId: '',
        exerciseId: '',
        quizId: '',
        orderIndex: 1,
        dueAt: '', // for exercise
        startAt: '', // for quiz
        endAt: '', // for quiz
        showQuizAnswers: false, // for quiz
        showQuizScore: true, // for quiz
    });
    const [errors, setErrors] = useState({});

    const lessonTypeOptions = [
        { value: 'lecture', label: 'Bài giảng' },
        { value: 'exercise', label: 'Bài tập' },
        { value: 'quiz', label: 'Bài kiểm tra' },
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleLessonTypeChange = (value) => {
        setLessonType(value);
        setErrors({});
    };

    const validate = () => {
        const newErrors = {};

        // Validate based on lesson type
        if (lessonType === 'lecture' && !formData.lectureId.trim()) {
            newErrors.lectureId = 'ID bài giảng không được để trống';
        }
        if (lessonType === 'exercise' && !formData.exerciseId.trim()) {
            newErrors.exerciseId = 'ID bài tập không được để trống';
        }
        if (lessonType === 'quiz' && !formData.quizId.trim()) {
            newErrors.quizId = 'ID bài kiểm tra không được để trống';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Prepare data based on lesson type
        const submitData = {
            classroomId: parseInt(classroomId),
        };

        if (lessonType === 'lecture') {
            submitData.lectureId = parseInt(formData.lectureId);
            submitData.orderIndex = parseInt(formData.orderIndex) || 1;
        } else if (lessonType === 'exercise') {
            submitData.exerciseId = parseInt(formData.exerciseId);
            submitData.dueAt = formData.dueAt || null;
            submitData.orderIndex = parseInt(formData.orderIndex) || 1;
        } else if (lessonType === 'quiz') {
            submitData.quizId = parseInt(formData.quizId);
            submitData.startAt = formData.startAt;
            submitData.endAt = formData.endAt;
            submitData.showQuizAnswers = formData.showQuizAnswers;
            submitData.showQuizScore = formData.showQuizScore;
            submitData.orderIndex = parseInt(formData.orderIndex) || 1;
        }

        onSubmit(submitData, lessonType);
    };

    const handleClose = () => {
        setFormData({
            lectureId: '',
            exerciseId: '',
            quizId: '',
            orderIndex: 1,
            dueAt: '',
            startAt: '',
            endAt: '',
            showQuizAnswers: false,
            showQuizScore: true,
        });
        setLessonType('lecture');
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />

            {/* Panel */}
            <div className="fixed right-0 top-0 h-screen w-[450px] bg-primary shadow-lg z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                    <h2 className="text-lg font-semibold text-foreground">Thêm buổi học mới</h2>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-foreground transition-colors"
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                        {/* Lesson Type Selector */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Loại buổi học <span className="text-error">*</span>
                            </label>
                            <Dropdown
                                value={lessonType}
                                onChange={handleLessonTypeChange}
                                options={lessonTypeOptions}
                                placeholder="Chọn loại buổi học"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Conditional Fields based on lesson type */}
                        {lessonType === 'lecture' && (
                            <Input
                                label="ID Bài giảng"
                                name="lectureId"
                                type="number"
                                value={formData.lectureId}
                                onChange={handleChange}
                                placeholder="Nhập ID bài giảng"
                                required
                                error={errors.lectureId}
                                disabled={isLoading}
                            />
                        )}

                        {lessonType === 'exercise' && (
                            <Input
                                label="ID Bài tập"
                                name="exerciseId"
                                type="number"
                                value={formData.exerciseId}
                                onChange={handleChange}
                                placeholder="Nhập ID bài tập"
                                required
                                error={errors.exerciseId}
                                disabled={isLoading}
                            />
                        )}

                        {lessonType === 'quiz' && (
                            <Input
                                label="ID Bài kiểm tra"
                                name="quizId"
                                type="number"
                                value={formData.quizId}
                                onChange={handleChange}
                                placeholder="Nhập ID bài kiểm tra"
                                required
                                error={errors.quizId}
                                disabled={isLoading}
                            />
                        )}

                        {/* Order Index */}
                        <Input
                            label="Thứ tự"
                            name="orderIndex"
                            type="number"
                            value={formData.orderIndex}
                            onChange={handleChange}
                            placeholder="Thứ tự hiển thị"
                            disabled={isLoading}
                            min="1"
                        />

                        {/* Exercise specific: Due Date */}
                        {lessonType === 'exercise' && (
                            <DateTimePicker
                                label="Hạn nộp bài"
                                value={formData.dueAt}
                                onChange={(value) => setFormData(prev => ({ ...prev, dueAt: value }))}
                                disabled={isLoading}
                                placeholder="Chọn thời gian hạn nộp"
                            />
                        )}

                        {/* Quiz specific fields */}
                        {lessonType === 'quiz' && (
                            <>
                                <DateTimePicker
                                    label="Thời gian bắt đầu"
                                    value={formData.startAt}
                                    onChange={(value) => setFormData(prev => ({ ...prev, startAt: value }))}
                                    disabled={isLoading}
                                    placeholder="Chọn thời gian bắt đầu"
                                    required
                                />

                                <DateTimePicker
                                    label="Thời gian kết thúc"
                                    value={formData.endAt}
                                    onChange={(value) => setFormData(prev => ({ ...prev, endAt: value }))}
                                    disabled={isLoading}
                                    placeholder="Chọn thời gian kết thúc"
                                    required
                                />

                                <Checkbox
                                    id="showQuizAnswers"
                                    checked={formData.showQuizAnswers}
                                    onChange={(checked) => setFormData(prev => ({ ...prev, showQuizAnswers: checked }))}
                                    label="Hiển thị đáp án sau khi làm"
                                />

                                <Checkbox
                                    id="showQuizScore"
                                    checked={formData.showQuizScore}
                                    onChange={(checked) => setFormData(prev => ({ ...prev, showQuizScore: checked }))}
                                    label="Hiển thị điểm số"
                                />
                            </>
                        )}

                        {/* Info box */}
                        <div className="bg-info-bg border-l-4 border-info px-3 py-2 rounded-sm">
                            <p className="text-xs text-info-text">
                                {lessonType === 'lecture' && 'Bài giảng sẽ được gán vào lớp học theo thứ tự.'}
                                {lessonType === 'exercise' && 'Bài tập sẽ được gán với hạn nộp bài (tùy chọn). Học sinh có thể nộp bài qua hệ thống.'}
                                {lessonType === 'quiz' && 'Bài kiểm tra yêu cầu thời gian bắt đầu và kết thúc. Học sinh chỉ làm bài trong khoảng thời gian này.'}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-border flex gap-2 flex-shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button type="submit" loading={isLoading} disabled={isLoading} className="flex-1">
                            Thêm buổi học
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};
