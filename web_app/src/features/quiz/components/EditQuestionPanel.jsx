import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button, Input } from '../../../shared/components/ui';

export const EditQuestionPanel = ({ isOpen, onClose, onSubmit, isLoading, question, quizId }) => {
    const [formData, setFormData] = useState({
        content: '',
        explanation: '',
        questionType: 0,
        points: 1,
        orderIndex: 0,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (question) {
            setFormData({
                content: question.content || '',
                explanation: question.explanation || '',
                questionType: question.questionType ?? 0,
                points: question.points || 1,
                orderIndex: question.orderIndex || 0,
            });
        }
    }, [question]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.content.trim()) {
            newErrors.content = 'Nội dung câu hỏi không được để trống';
        }
        if (formData.points <= 0) {
            newErrors.points = 'Điểm phải lớn hơn 0';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const questionTypeValue = parseInt(formData.questionType);
        const pointsValue = parseFloat(formData.points);
        const orderIndexValue = parseInt(formData.orderIndex);

        const submitData = {
            sectionId: question.sectionId || undefined,
            groupId: question.groupId || undefined,
            content: formData.content.trim(),
            explanation: formData.explanation.trim() || undefined,
            questionType: isNaN(questionTypeValue) ? 0 : questionTypeValue,
            points: isNaN(pointsValue) ? 1 : pointsValue,
            orderIndex: isNaN(orderIndexValue) ? 0 : orderIndexValue,
        };

        console.log('EditQuestionPanel - submitData:', submitData);
        console.log('EditQuestionPanel - formData:', formData);
        onSubmit(submitData);
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
            <div className="fixed right-0 top-0 h-screen w-[600px] bg-primary shadow-lg z-50 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Sửa câu hỏi</h2>
                    <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-sm" disabled={isLoading}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Nội dung câu hỏi <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Nhập nội dung câu hỏi"
                                disabled={isLoading}
                                rows={4}
                                className={`w-full px-3 py-2 text-sm border rounded-sm focus:outline-none focus:border-foreground bg-primary disabled:opacity-50 resize-none ${
                                    errors.content ? 'border-red-500' : 'border-border'
                                }`}
                            />
                            {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Giải thích</label>
                            <textarea
                                name="explanation"
                                value={formData.explanation}
                                onChange={handleChange}
                                placeholder="Nhập giải thích cho câu hỏi (tùy chọn)"
                                disabled={isLoading}
                                rows={3}
                                className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary disabled:opacity-50 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Loại câu hỏi</label>
                                <select
                                    name="questionType"
                                    value={formData.questionType}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary disabled:opacity-50"
                                >
                                    <option value={0}>Chọn 1 đáp án</option>
                                    <option value={1}>Chọn nhiều đáp án</option>
                                </select>
                            </div>

                            <Input
                                label="Điểm"
                                name="points"
                                type="number"
                                step="0.5"
                                value={formData.points}
                                onChange={handleChange}
                                error={errors.points}
                                disabled={isLoading}
                            />
                        </div>

                        <Input
                            label="Thứ tự"
                            name="orderIndex"
                            type="number"
                            value={formData.orderIndex}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="p-4 border-t border-border flex gap-2">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="flex-1">
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};
