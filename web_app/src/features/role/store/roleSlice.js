import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { roleApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  roles: [],
  currentRole: null,
  loading: false,
  roleDetailLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
};

// Async thunks
export const getAllRolesAsync = createAsyncThunk(
  'role/getAll',
  async (_, thunkAPI) => {
    return handleAsyncThunk(
      () => roleApi.getAll(),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải danh sách vai trò',
      }
    );
  }
);

export const getRoleByIdAsync = createAsyncThunk(
  'role/getById',
  async (roleId, thunkAPI) => {
    return handleAsyncThunk(
      () => roleApi.getById(roleId),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải thông tin vai trò',
      }
    );
  }
);

export const createRoleAsync = createAsyncThunk(
  'role/create',
  async (data, thunkAPI) => {
    return handleAsyncThunk(
      () => roleApi.create(data),
      thunkAPI,
      {
        successTitle: 'Tạo vai trò thành công',
        successMessage: `Vai trò "${data.roleName}" đã được tạo`,
        errorTitle: 'Tạo vai trò thất bại',
      }
    );
  }
);

export const updateRoleAsync = createAsyncThunk(
  'role/update',
  async ({ roleId, data }, thunkAPI) => {
    return handleAsyncThunk(
      () => roleApi.update(roleId, data),
      thunkAPI,
      {
        successTitle: 'Cập nhật vai trò thành công',
        successMessage: 'Thông tin vai trò đã được cập nhật',
        errorTitle: 'Cập nhật vai trò thất bại',
      }
    );
  }
);

export const deleteRoleAsync = createAsyncThunk(
  'role/delete',
  async (roleId, thunkAPI) => {
    return handleAsyncThunk(
      () => roleApi.delete(roleId),
      thunkAPI,
      {
        successTitle: 'Xóa vai trò thành công',
        successMessage: 'Vai trò đã được xóa',
        errorTitle: 'Xóa vai trò thất bại',
      }
    );
  }
);

export const assignPermissionsAsync = createAsyncThunk(
  'role/assignPermissions',
  async ({ roleId, permissionIds }, thunkAPI) => {
    return handleAsyncThunk(
      () => roleApi.assignPermissions(roleId, permissionIds),
      thunkAPI,
      {
        successTitle: 'Cập nhật quyền thành công',
        successMessage: 'Quyền đã được gán cho vai trò',
        errorTitle: 'Cập nhật quyền thất bại',
      }
    );
  }
);

export const toggleRolePermissionAsync = createAsyncThunk(
  'role/togglePermission',
  async ({ roleId, permissionId }, thunkAPI) => {
    return handleAsyncThunk(
      () => roleApi.togglePermission(roleId, permissionId),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Cập nhật quyền thất bại',
      }
    );
  }
);

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    clearCurrentRole: (state) => {
      state.currentRole = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all roles
      .addCase(getAllRolesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRolesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.data || action.payload || [];
        state.error = null;
      })
      .addCase(getAllRolesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get role by ID
      .addCase(getRoleByIdAsync.pending, (state) => {
        state.roleDetailLoading = true;
        state.error = null;
      })
      .addCase(getRoleByIdAsync.fulfilled, (state, action) => {
        state.roleDetailLoading = false;
        state.currentRole = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(getRoleByIdAsync.rejected, (state, action) => {
        state.roleDetailLoading = false;
        state.error = action.payload;
      })
      // Create role
      .addCase(createRoleAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createRoleAsync.fulfilled, (state, action) => {
        state.createLoading = false;
        const newRole = action.payload.data || action.payload;
        state.roles.push(newRole);
        state.error = null;
      })
      .addCase(createRoleAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      // Update role
      .addCase(updateRoleAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateRoleAsync.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedRole = action.payload.data || action.payload;
        const index = state.roles.findIndex(r => r.roleId === updatedRole.roleId);
        if (index !== -1) {
          state.roles[index] = updatedRole;
        }
        if (state.currentRole?.roleId === updatedRole.roleId) {
          state.currentRole = updatedRole;
        }
        state.error = null;
      })
      .addCase(updateRoleAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Delete role
      .addCase(deleteRoleAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteRoleAsync.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const roleId = action.meta.arg;
        state.roles = state.roles.filter(r => r.roleId !== roleId);
        if (state.currentRole?.roleId === roleId) {
          state.currentRole = null;
        }
        state.error = null;
      })
      .addCase(deleteRoleAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })
      // Assign permissions
      .addCase(assignPermissionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignPermissionsAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(assignPermissionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle permission
      .addCase(toggleRolePermissionAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleRolePermissionAsync.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(toggleRolePermissionAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCurrentRole, clearError } = roleSlice.actions;
export default roleSlice.reducer;
