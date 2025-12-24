import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useAppDispatch } from '../../../core/store/hooks';
import { toggleRolePermissionAsync, getRoleByIdAsync } from '../store/roleSlice';
import { Switch } from '../../../shared/components/ui';
import { groupPermissionsByModule, capitalizeFirstLetter, getPermissionAction } from '../../../utils/permissionHelpers';

export const PermissionsSelector = ({ permissions = [], selectedPermissions = [], roleId, disabled = false }) => {
    const dispatch = useAppDispatch();
    const [expandedModules, setExpandedModules] = useState({});
    const [loadingPermissions, setLoadingPermissions] = useState({});

    const handlePermissionToggle = async (permissionId) => {
        if (!roleId) return;
        
        setLoadingPermissions(prev => ({ ...prev, [permissionId]: true }));
        
        try {
            await dispatch(toggleRolePermissionAsync({ roleId, permissionId })).unwrap();
            // Fetch lại role để cập nhật permissions
            await dispatch(getRoleByIdAsync(roleId));
        } catch (error) {
            console.error('Toggle permission error:', error);
        } finally {
            setLoadingPermissions(prev => ({ ...prev, [permissionId]: false }));
        }
    };

    const handleModuleToggle = (module) => {
        setExpandedModules(prev => ({
            ...prev,
            [module]: !prev[module]
        }));
    };

    const groupedPermissions = groupPermissionsByModule(permissions);
    const moduleNames = Object.keys(groupedPermissions).sort();

    return (
        <div>
            <label className="block text-sm font-medium text-foreground mb-2">
                Quyền hạn
            </label>
            <div className="border border-border rounded-sm">
                {moduleNames.length === 0 ? (
                    <div className="p-4 text-sm text-foreground-light text-center">
                        Không có quyền hạn nào
                    </div>
                ) : (
                    moduleNames.map((module) => (
                        <div key={module} className="border-b border-border last:border-b-0">
                            {/* Module Header */}
                            <button
                                type="button"
                                onClick={() => handleModuleToggle(module)}
                                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                                disabled={disabled}
                            >
                                <span className="font-medium text-foreground">
                                    {capitalizeFirstLetter(module)}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-foreground-light">
                                        {groupedPermissions[module].filter(p => selectedPermissions.includes(p.permissionId)).length}/{groupedPermissions[module].length}
                                    </span>
                                    {expandedModules[module] ? (
                                        <ChevronDown size={16} className="text-foreground-light" />
                                    ) : (
                                        <ChevronRight size={16} className="text-foreground-light" />
                                    )}
                                </div>
                            </button>

                            {/* Module Permissions */}
                            {expandedModules[module] && (
                                <div className="px-3 pb-3 space-y-2">
                                    {groupedPermissions[module].map((permission) => (
                                        <div
                                            key={permission.permissionId}
                                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                                        >
                                            <div className="flex-1">
                                                <div className="text-sm text-foreground">
                                                    {getPermissionAction(permission.permissionName)}
                                                </div>
                                                {permission.path && (
                                                    <div className="text-xs text-foreground-light">
                                                        {permission.method} {permission.path}
                                                    </div>
                                                )}
                                            </div>
                                            <Switch
                                                checked={selectedPermissions.includes(permission.permissionId)}
                                                onChange={() => handlePermissionToggle(permission.permissionId)}
                                                disabled={disabled || !roleId}
                                                loading={loadingPermissions[permission.permissionId]}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {selectedPermissions.length > 0 && (
                <div className="mt-2 text-xs text-foreground-light">
                    Đã chọn {selectedPermissions.length} quyền
                </div>
            )}
        </div>
    );
};
