import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button, Input } from '../../../shared/components/ui';
import { PermissionsSelector } from './PermissionsSelector';

export const EditRolePanel = ({ isOpen, onClose, onSubmit, isLoading, role, permissions = [] }) => {
    const [formData, setFormData] = useState({
        roleName: '',
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    // Update form and selected permissions when role changes
    useEffect(() => {
        if (role) {
            setFormData({
                roleName: role.roleName || '',
                description: role.description || ''
            });

            // Set selected permissions from role
            if (role.permissions && Array.isArray(role.permissions)) {
                setSelectedPermissions(role.permissions.map(p => p.permissionId));
            } else {
                setSelectedPermissions([]);
            }
        }
    }, [role]);

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
        if (!formData.roleName.trim()) {
            newErrors.roleName = 'Tên vai trò không được để trống';
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
        setFormData({ roleName: '', description: '' });
        setErrors({});
        setSelectedPermissions([]);
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
                    <h2 className="text-lg font-semibold text-foreground">Chỉnh sửa vai trò</h2>
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
                            label="Tên vai trò"
                            name="roleName"
                            value={formData.roleName}
                            onChange={handleChange}
                            placeholder="Nhập tên vai trò"
                            required
                            error={errors.roleName}
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
                                placeholder="Nhập mô tả vai trò (tùy chọn)"
                                rows={3}
                                disabled={isLoading}
                                className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                            />
                        </div>

                        <PermissionsSelector
                            permissions={permissions}
                            selectedPermissions={selectedPermissions}
                            roleId={role?.roleId}
                            disabled={isLoading}
                        />
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
                            Cập nhật
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};
