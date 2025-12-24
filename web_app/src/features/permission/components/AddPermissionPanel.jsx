import { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Input } from '../../../shared/components/ui';

export const AddPermissionPanel = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    permissionName: '',
    path: '',
    method: 'GET',
    module: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.permissionName.trim()) {
      newErrors.permissionName = 'Tên quyền không được để trống';
    }
    if (!formData.path.trim()) {
      newErrors.path = 'Đường dẫn không được để trống';
    }
    if (!formData.module.trim()) {
      newErrors.module = 'Module không được để trống';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ permissionName: '', path: '', method: 'GET', module: '' });
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
      <div className="fixed right-0 top-0 h-screen w-[400px] bg-primary shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-foreground">Thêm quyền mới</h2>
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
              label="Tên quyền"
              name="permissionName"
              value={formData.permissionName}
              onChange={handleChange}
              placeholder="Nhập tên quyền (vd: user.view)"
              required
              error={errors.permissionName}
              disabled={isLoading}
            />

            <Input
              label="Module"
              name="module"
              value={formData.module}
              onChange={handleChange}
              placeholder="Nhập tên module (vd: User)"
              required
              error={errors.module}
              disabled={isLoading}
            />

            <Input
              label="Đường dẫn"
              name="path"
              value={formData.path}
              onChange={handleChange}
              placeholder="Nhập đường dẫn API (vd: /api/Users)"
              required
              error={errors.path}
              disabled={isLoading}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Phương thức HTTP
              </label>
              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
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
              Thêm
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
