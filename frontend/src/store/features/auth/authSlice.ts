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
    ApiResponse<any> & { user?: any },
    LoginRequest
>(
    'auth/login',
    async (credentials: LoginRequest, { dispatch, rejectWithValue }) => {
        try {
            // 1. Đăng nhập
            const loginResponse = await authApi.login(credentials);
            
            if (loginResponse.data?.accessToken) {
                // 2. Lưu tokens - backend trả về trực tiếp AuthTokensDto
                auth.setAccessToken(loginResponse.data.accessToken);
                auth.setRefreshToken(loginResponse.data.refreshToken);
                
                // 3. Fetch user info
                const userResponse = await authApi.getMe();
                
                return {
                    ...loginResponse,
                    user: userResponse.data
                };
            }
            
            return loginResponse;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Đăng nhập thất bại');
        }
    }
);


export const register = createAsyncThunk<
    ApiResponse<any> & { user?: any },
    RegisterStudentRequest
>(
    'auth/register',
    async (userData: RegisterStudentRequest, { dispatch, rejectWithValue }) => {
        try {
            // 1. Đăng ký
            const registerResponse = await authApi.register(userData);
            
            if (registerResponse.data?.accessToken) {
                // 2. Lưu tokens
                auth.setAccessToken(registerResponse.data.accessToken);
                auth.setRefreshToken(registerResponse.data.refreshToken);
                
                // 3. Fetch user info
                const userResponse = await authApi.getMe();
                
                return {
                    ...registerResponse,
                    user: userResponse.data
                };
            }
            
            return registerResponse;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Đăng ký thất bại');
        }
    }
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

export const fetchUserInfo = createAsyncThunk<
    ApiResponse<any>
>(
    'auth/fetchUserInfo',
    createAsyncThunkHandler(
        () => authApi.getMe(),
        'Lấy thông tin người dùng thất bại'
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
                const user = action.payload.user
                if (!data) return
                state.isLoading = false;
                if (user) {
                    state.student = user;
                }
                state.accessToken = data.accessToken;
                state.refreshToken = data.refreshToken;
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
                const data = action.payload.data
                const user = action.payload.user
                if (!data) return
                state.isLoading = false;
                state.accessToken = data.accessToken;
                state.refreshToken = data.refreshToken;
                if (user) {
                    state.student = user;
                }
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
