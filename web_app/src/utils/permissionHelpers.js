/**
 * Groups permissions by their module property
 * Example: permissions with module='User', module='Role' -> { User: [...], Role: [...] }
 * @param {Array} permissions - Array of permission objects with module property
 * @returns {Object} - Object with module names as keys and arrays of permissions as values
 */
export const groupPermissionsByModule = (permissions) => {
    if (!permissions || !Array.isArray(permissions)) {
        return {};
    }

    const grouped = {};

    permissions.forEach((permission) => {
        const module = permission.module || 'Other'; // Use module property, default to 'Other'

        if (!grouped[module]) {
            grouped[module] = [];
        }

        grouped[module].push(permission);
    });

    // Sort permissions within each module alphabetically
    Object.keys(grouped).forEach((module) => {
        grouped[module].sort((a, b) => 
            a.permissionName.localeCompare(b.permissionName)
        );
    });

    return grouped;
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Extracts the action name from a permission name
 * Example: user.view -> view, role.manage -> manage
 * @param {string} permissionName - Full permission name
 * @returns {string} - Action part of the permission
 */
export const getPermissionAction = (permissionName) => {
    if (!permissionName) return '';
    const parts = permissionName.split('.');
    return parts.length > 1 ? parts.slice(1).join('.') : permissionName;
};
