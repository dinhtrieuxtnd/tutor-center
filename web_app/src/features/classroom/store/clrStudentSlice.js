import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clrStudentApi } from '../../../core/api/clrStudentApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    students: [],
    loading: false,
    removeLoading: false,
    error: null,
    selectedClassroomId: null,
};

// Async thunks
export const getStudentsByClassroomIdAsync = createAsyncThunk(
    'clrStudent/getStudentsByClassroomId',
    async (classroomId, thunkAPI) => {
        return handleAsyncThunk(
            () => clrStudentApi.getStudentsByClassroomId(classroomId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lỗi tải danh sách học sinh',
            }
        );
    }
);

export const removeStudentFromClassroomAsync = createAsyncThunk(
    'clrStudent/removeStudent',
    async ({ classroomId, studentId }, thunkAPI) => {
        return handleAsyncThunk(
            () => clrStudentApi.removeStudentFromClassroom(classroomId, studentId),
            thunkAPI,
            {
                successTitle: 'Xóa học sinh thành công',
                successMessage: 'Học sinh đã được xóa khỏi lớp học',
                errorTitle: 'Xóa học sinh thất bại',
            }
        );
    }
);

const clrStudentSlice = createSlice({
    name: 'clrStudent',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSelectedClassroomId: (state, action) => {
            state.selectedClassroomId = action.payload;
        },
        clearStudents: (state) => {
            state.students = [];
            state.selectedClassroomId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get students by classroom ID
            .addCase(getStudentsByClassroomIdAsync.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.selectedClassroomId = action.meta.arg;
            })
            .addCase(getStudentsByClassroomIdAsync.fulfilled, (state, action) => {
                state.loading = false;
                const response = action.payload.data || action.payload;
                state.students = Array.isArray(response) ? response : [];
                state.error = null;
            })
            .addCase(getStudentsByClassroomIdAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove student from classroom
            .addCase(removeStudentFromClassroomAsync.pending, (state) => {
                state.removeLoading = true;
                state.error = null;
            })
            .addCase(removeStudentFromClassroomAsync.fulfilled, (state, action) => {
                state.removeLoading = false;
                // Remove student from local state after successful deletion
                // This will be handled by the component by refetching the list
                state.error = null;
            })
            .addCase(removeStudentFromClassroomAsync.rejected, (state, action) => {
                state.removeLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, setSelectedClassroomId, clearStudents } = clrStudentSlice.actions;

export default clrStudentSlice.reducer;
