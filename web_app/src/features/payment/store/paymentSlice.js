import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentApi } from '../../../core/api/paymentApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    payments: [],
    loading: false,
    error: null,
};

// Async thunks
export const getPaymentsByClassroomAsync = createAsyncThunk(
    'payment/getByClassroom',
    async (classroomId, thunkAPI) => {
        return handleAsyncThunk(
            () => paymentApi.getByClassroom(classroomId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy danh sách thanh toán thất bại',
            }
        );
    }
);

// Slice
const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearPayments: (state) => {
            state.payments = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Get payments by classroom
            .addCase(getPaymentsByClassroomAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPaymentsByClassroomAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
            })
            .addCase(getPaymentsByClassroomAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearPayments } = paymentSlice.actions;
export default paymentSlice.reducer;
