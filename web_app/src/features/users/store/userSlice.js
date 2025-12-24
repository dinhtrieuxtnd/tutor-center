import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../../core/api';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await userApi.getAll();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await userApi.getById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user by id
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
