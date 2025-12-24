import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { permissionApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  permissions: [],
  permissionsByModule: {},
  currentPermission: null,
  loading: false,
  permissionDetailLoading: false,
  moduleLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
  // Pagination & Filters
  currentPage: 1,
  itemsPerPage: 20,
  searchTerm: '',
  filters: {},
};

// Async thunks
export const getAllPermissionsAsync = createAsyncThunk(
  'permission/getAll',
  async (_, thunkAPI) => {
    return handleAsyncThunk(
      () => permissionApi.getAll(),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải danh sách quyền',
      }
    );
  }
);

export const getPermissionByIdAsync = createAsyncThunk(
  'permission/getById',
  async (permissionId, thunkAPI) => {
    return handleAsyncThunk(
      () => permissionApi.getById(permissionId),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải thông tin quyền',
      }
    );
  }
);

export const getPermissionsByModuleAsync = createAsyncThunk(
  'permission/getByModule',
  async (module, thunkAPI) => {
    return handleAsyncThunk(
      () => permissionApi.getByModule(module),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải quyền theo module',
      }
    );
  }
);

export const createPermissionAsync = createAsyncThunk(
  'permission/create',
  async (data, thunkAPI) => {
    return handleAsyncThunk(
      () => permissionApi.create(data),
      thunkAPI,
      {
        successTitle: 'Tạo quyền thành công',
        successMessage: `Quyền "${data.permissionName}" đã được tạo`,
        errorTitle: 'Tạo quyền thất bại',
      }
    );
  }
);

export const updatePermissionAsync = createAsyncThunk(
  'permission/update',
  async ({ permissionId, data }, thunkAPI) => {
    return handleAsyncThunk(
      () => permissionApi.update(permissionId, data),
      thunkAPI,
      {
        successTitle: 'Cập nhật quyền thành công',
        successMessage: 'Thông tin quyền đã được cập nhật',
        errorTitle: 'Cập nhật quyền thất bại',
      }
    );
  }
);

export const deletePermissionAsync = createAsyncThunk(
  'permission/delete',
  async (permissionId, thunkAPI) => {
    return handleAsyncThunk(
      () => permissionApi.delete(permissionId),
      thunkAPI,
      {
        successTitle: 'Xóa quyền thành công',
        successMessage: 'Quyền đã được xóa',
        errorTitle: 'Xóa quyền thất bại',
      }
    );
  }
);

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    clearCurrentPermission: (state) => {
      state.currentPermission = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSearchTerm: (state, action) => {
      console.log('[permissionSlice] setSearchTerm:', action.payload, '-> resetting to page 1');
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      console.log('[permissionSlice] setFilter:', key, value, '-> resetting to page 1');
      state.filters[key] = value;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      console.log('[permissionSlice] setCurrentPage:', action.payload);
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      console.log('[permissionSlice] setItemsPerPage:', action.payload, '-> resetting to page 1');
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      console.log('[permissionSlice] resetFilters -> resetting to page 1');
      state.searchTerm = '';
      state.filters = {};
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all permissions
      .addCase(getAllPermissionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPermissionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload.data || action.payload || [];
        state.error = null;
      })
      .addCase(getAllPermissionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get permission by ID
      .addCase(getPermissionByIdAsync.pending, (state) => {
        state.permissionDetailLoading = true;
        state.error = null;
      })
      .addCase(getPermissionByIdAsync.fulfilled, (state, action) => {
        state.permissionDetailLoading = false;
        state.currentPermission = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(getPermissionByIdAsync.rejected, (state, action) => {
        state.permissionDetailLoading = false;
        state.error = action.payload;
      })
      // Get permissions by module
      .addCase(getPermissionsByModuleAsync.pending, (state) => {
        state.moduleLoading = true;
        state.error = null;
      })
      .addCase(getPermissionsByModuleAsync.fulfilled, (state, action) => {
        state.moduleLoading = false;
        const module = action.meta.arg;
        state.permissionsByModule[module] = action.payload.data || action.payload || [];
        state.error = null;
      })
      .addCase(getPermissionsByModuleAsync.rejected, (state, action) => {
        state.moduleLoading = false;
        state.error = action.payload;
      })
      // Create permission
      .addCase(createPermissionAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createPermissionAsync.fulfilled, (state, action) => {
        state.createLoading = false;
        const newPermission = action.payload.data || action.payload;
        state.permissions.push(newPermission);
        state.error = null;
      })
      .addCase(createPermissionAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      // Update permission
      .addCase(updatePermissionAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updatePermissionAsync.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedPermission = action.payload.data || action.payload;
        const index = state.permissions.findIndex(p => p.permissionId === updatedPermission.permissionId);
        if (index !== -1) {
          state.permissions[index] = updatedPermission;
        }
        if (state.currentPermission?.permissionId === updatedPermission.permissionId) {
          state.currentPermission = updatedPermission;
        }
        state.error = null;
      })
      .addCase(updatePermissionAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Delete permission
      .addCase(deletePermissionAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deletePermissionAsync.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const permissionId = action.meta.arg;
        state.permissions = state.permissions.filter(p => p.permissionId !== permissionId);
        if (state.currentPermission?.permissionId === permissionId) {
          state.currentPermission = null;
        }
        state.error = null;
      })
      .addCase(deletePermissionAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearCurrentPermission, 
  clearError,
  setSearchTerm,
  setFilter,
  setCurrentPage,
  setItemsPerPage,
  resetFilters,
} = permissionSlice.actions;

// Selectors
export const selectFilteredPermissions = (state) => {
  const { permissions, searchTerm, filters } = state.permission;
  const searchFields = ['permissionName', 'module', 'path'];
  
  let result = [...permissions];

  // Apply search
  if (searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    result = result.filter((item) =>
      searchFields.some((field) => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value?.toString().toLowerCase().includes(lowerSearch);
      })
    );
  }

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all') {
      result = result.filter((item) => {
        const itemValue = key.split('.').reduce((obj, k) => obj?.[k], item);
        return itemValue === value;
      });
    }
  });

  return result;
};

export const selectPaginatedPermissions = (state) => {
  const filteredPermissions = selectFilteredPermissions(state);
  const { currentPage, itemsPerPage } = state.permission;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return filteredPermissions.slice(startIndex, endIndex);
};

export const selectPaginationInfo = (state) => {
  const filteredPermissions = selectFilteredPermissions(state);
  const { currentPage, itemsPerPage, permissions } = state.permission;
  
  return {
    totalItems: filteredPermissions.length,
    totalOriginalItems: permissions.length,
    totalPages: Math.ceil(filteredPermissions.length / itemsPerPage),
    currentPage,
    itemsPerPage,
  };
};

export default permissionSlice.reducer;
