import { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Input } from '../../../shared/components/ui';
import { MediaUpload } from '../../media/component';

export const AddExercisePanel = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    attachMediaId: null,
  });
  const [mediaInfo, setMediaInfo] = useState({
    url: null,
    name: null
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMediaUpdate = (mediaId, mediaUrl, mediaName) => {
    setFormData(prev => ({ ...prev, attachMediaId: mediaId }));
    setMediaInfo({ url: mediaUrl, name: mediaName });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Only send fields that have values
    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      attachMediaId: formData.attachMediaId || undefined,
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', attachMediaId: null });
    setMediaInfo({ url: null, name: null });
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
      <div className="fixed right-0 top-0 h-screen w-[500px] bg-primary shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-foreground">Thêm bài tập mới</h2>
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
              placeholder="Nhập tiêu đề bài tập"
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
                placeholder="Nhập mô tả bài tập (tùy chọn)"
                disabled={isLoading}
                rows={6}
                className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>

            <MediaUpload
              currentMediaUrl={mediaInfo.url}
              currentMediaName={mediaInfo.name}
              onMediaUpdate={handleMediaUpdate}
              label="File đính kèm (tùy chọn)"
              accept="*/*"
              disabled={isLoading}
            />

            <div className="border-t border-border pt-4 mt-4">
              <p className="text-xs text-foreground-light mb-2">
                <strong>Lưu ý:</strong> File đính kèm có thể là đề bài, tài liệu hướng dẫn hoặc template.
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
