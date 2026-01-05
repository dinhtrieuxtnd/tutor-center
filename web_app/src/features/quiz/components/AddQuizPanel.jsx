import { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Input } from '../../../shared/components/ui';
import { GRADING_METHOD, GRADING_METHOD_LABELS } from '../../../core/constants';

export const AddQuizPanel = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeLimitSec: '',
    maxAttempts: 1,
    shuffleQuestions: true,
    shuffleOptions: true,
    gradingMethod: GRADING_METHOD.HIGHEST,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    }
    if (!formData.timeLimitSec || formData.timeLimitSec <= 0) {
      newErrors.timeLimitSec = 'Thời gian phải lớn hơn 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      timeLimitSec: parseInt(formData.timeLimitSec),
      maxAttempts: parseInt(formData.maxAttempts) || 1,
      shuffleQuestions: formData.shuffleQuestions,
      shuffleOptions: formData.shuffleOptions,
      gradingMethod: formData.gradingMethod,
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      timeLimitSec: '',
      maxAttempts: 1,
      shuffleQuestions: true,
      shuffleOptions: true,
      gradingMethod: GRADING_METHOD.HIGHEST,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-screen w-[600px] bg-primary shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-foreground">Thêm bài kiểm tra mới</h2>
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
            <Input
              label="Tiêu đề"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề bài kiểm tra"
              required
              error={errors.title}
              disabled={isLoading}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả (tùy chọn)"
                disabled={isLoading}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Thời gian (giây)"
                name="timeLimitSec"
                type="number"
                value={formData.timeLimitSec}
                onChange={handleChange}
                placeholder="Thời gian làm bài (giây)"
                required
                error={errors.timeLimitSec}
                disabled={isLoading}
              />

              <Input
                label="Số lần thử"
                name="maxAttempts"
                type="number"
                value={formData.maxAttempts}
                onChange={handleChange}
                placeholder="Số lần thử"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Phương thức chấm điểm
              </label>
              <select
                name="gradingMethod"
                value={formData.gradingMethod}
                onChange={(e) => setFormData(prev => ({ ...prev, gradingMethod: parseInt(e.target.value) }))}
                disabled={isLoading}
                className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value={GRADING_METHOD.FIRST}>{GRADING_METHOD_LABELS[GRADING_METHOD.FIRST]}</option>
                <option value={GRADING_METHOD.HIGHEST}>{GRADING_METHOD_LABELS[GRADING_METHOD.HIGHEST]}</option>
                <option value={GRADING_METHOD.AVERAGE}>{GRADING_METHOD_LABELS[GRADING_METHOD.AVERAGE]}</option>
                <option value={GRADING_METHOD.LATEST}>{GRADING_METHOD_LABELS[GRADING_METHOD.LATEST]}</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="shuffleQuestions"
                  checked={formData.shuffleQuestions}
                  onChange={(e) => setFormData(prev => ({ ...prev, shuffleQuestions: e.target.checked }))}
                  disabled={isLoading}
                  className="w-4 h-4"
                />
                <label className="text-sm text-foreground">
                  Xáo trộn câu hỏi
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="shuffleOptions"
                  checked={formData.shuffleOptions}
                  onChange={(e) => setFormData(prev => ({ ...prev, shuffleOptions: e.target.checked }))}
                  disabled={isLoading}
                  className="w-4 h-4"
                />
                <label className="text-sm text-foreground">
                  Xáo trộn đáp án
                </label>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs text-foreground-light">
                <strong>Lưu ý:</strong> Câu hỏi và đáp án sẽ được thêm sau khi tạo quiz.
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
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="flex-1"
            >
              Tạo mới
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
