import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { authApi } from "@/services"
import {
    ImageUrl,
    LoginRequest,
    LoginResponse,
    RegisterStudentRequest,
    Tokens,
    ApiResponse
} from "@/types"
import { auth, createAsyncThunkHandler, createAuthThunkHandler } from "@/utils"
import { StudentAuthState } from "@/types"
import { Student } from "@/types"

const initialState: StudentAuthState = {
    student: null,
    accessToken: auth.getAccessToken(),
    refreshToken: auth.getRefreshToken(),
    isLoading: false,
    error: null,
    isAuthenticated: !!auth.getAccessToken() && !!auth.getRefreshToken()
}

export const login = createAsyncThunk<
    ApiResponse<LoginResponse>,
    Omit<LoginRequest, 'userAgent' | 'ipAddress' | 'deviceFingerprint'>
>(
    'auth/login',
    createAuthThunkHandler(
        async (credentials: Omit<LoginRequest, 'userAgent' | 'ipAddress' | 'deviceFingerprint'>) => {
            // Thu thập thông tin device
            const { collectDeviceInfo } = await import('@/utils');
            const deviceInfo = await collectDeviceInfo();

            // Kết hợp credentials với device info
            const loginData: LoginRequest = {
                ...credentials,
                ...deviceInfo
            };

            return authApi.login(loginData);
        },
        'Đăng nhập học sinh thất bại',
        {
            successMessage: 'Đăng nhập thành công!',
            successTitle: 'Chào mừng học sinh',
            onSuccess: (response) => {
                auth.setAccessToken(response.data.tokens.accessToken)
                auth.setRefreshToken(response.data.tokens.refreshToken)
                return response;
            }
        }
    )
);


export const register = createAsyncThunk<
    Student,
    RegisterStudentRequest
>(
    'auth/register',
    createAuthThunkHandler(
        (userData: RegisterStudentRequest) => authApi.register(userData),
        'Đăng ký học sinh thất bại',
        {
            successMessage: 'Đăng ký thành công!',
            successTitle: 'Đăng nhập ngay',
            onSuccess: (response) => response
        }
    )
);

export const logout = createAsyncThunk<void>(
    'auth/logout',
    createAsyncThunkHandler(
        async () => {
            try {
                await authApi.logout(auth.getRefreshToken() || '');
            } finally {
                auth.clearAccessToken()
                auth.clearRefreshToken()
            }
        },
        'Đăng xuất học sinh thất bại'
    )
);

export const requestPasswordResetEmail = createAsyncThunk<
    ApiResponse<{ emailSent: string; expiresAt: string }>,
    string
>(
    'auth/requestPasswordResetEmail',
    createAsyncThunkHandler(
        (email: string) => authApi.requestPasswordResetEmail(email),
        "Gửi email reset password thất bại"
    )
)

export const resetPasswordWithToken = createAsyncThunk<
    ApiResponse<{ success: boolean }>,
    { token: string; newPassword: string }
>(
    "auth/resetPasswordWithToken",
    createAsyncThunkHandler(
    ({ token, newPassword }) =>
        authApi.resetPasswordWithToken(token, newPassword),
    "Đặt lại mật khẩu thất bại"    
    )
);

// Student Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearStudentError: (state) => {
            state.error = null;
        },
        setStudentUser: (state, action: PayloadAction<Student>) => {
            state.student = action.payload;
            state.isAuthenticated = true;
        },
        clearStudentAuth: (state) => {
            state.student = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.error = null;
            auth.clearAll()
        },
        initializeStudentAuth: (state) => {
            const accessToken = auth.getAccessToken()
            const refreshToken = auth.getRefreshToken()
            if (accessToken && refreshToken) {
                try {
                    state.accessToken = accessToken;
                    state.refreshToken = refreshToken;
                    state.isAuthenticated = true;
                } catch (error) {
                    auth.clearAccessToken()
                }
            }
        },
        setStudentAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setStudentRefreshToken: (state, action: PayloadAction<string>) => {
            state.refreshToken = action.payload;
        },
        updateUserAvatar: (state, action: PayloadAction<ImageUrl>) => {
            if (state.student) {
                if (state.student.imageUrls) {
                    state.student.imageUrls.url = action.payload.url;
                } else {
                    state.student.imageUrls = {
                        url: action.payload.url,
                        anotherUrl: action.payload.anotherUrl
                    };
                }
            }
        }

    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                const data = action.payload.data
                if (!data) return
                state.isLoading = false;
                state.student = data.user;
                state.accessToken = data.tokens.accessToken;
                state.refreshToken = data.tokens.refreshToken;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });

        // Register
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.student = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });

        // Logout
        builder
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.student = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state) => {
                state.isLoading = false;
                state.student = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
            });

            builder
            .addCase(requestPasswordResetEmail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(requestPasswordResetEmail.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(requestPasswordResetEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

            // Reset password with token
            builder
            .addCase(resetPasswordWithToken.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resetPasswordWithToken.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
                state.student = null; // bắt buộc login lại
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
            })
            .addCase(resetPasswordWithToken.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearStudentError, setStudentUser, clearStudentAuth, initializeStudentAuth, setStudentAccessToken, setStudentRefreshToken, updateUserAvatar } = authSlice.actions;
export default authSlice.reducer;
