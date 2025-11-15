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
import { auth, createAsyncThunkHandler, createAuthThunkHandler, authCookies } from "@/utils"
import { StudentAuthState } from "@/types"
import { Student } from "@/types"

const initialState: StudentAuthState = {
    student: null,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: null,
    isAuthenticated: false
}

export const login = createAsyncThunk<
    { data: any; user?: any },
    LoginRequest
>(
    'auth/login',
    async (credentials: LoginRequest, { dispatch, rejectWithValue }) => {
        try {
            // 1. Đăng nhập - Backend trả về {accessToken, refreshToken, expiresIn, tokenType}
            const loginResponse = await authApi.login(credentials);
            const tokens = (loginResponse as any).data || loginResponse;
            
            if (tokens.accessToken) {
                // 2. Lưu tokens
                auth.setAccessToken(tokens.accessToken);
                auth.setRefreshToken(tokens.refreshToken);
                
                // 3. Fetch user info
                const userResponse = await authApi.getMe();
                const user = (userResponse as any).data || userResponse;
                
                return {
                    data: tokens,
                    user: user
                };
            }
            
            return { data: tokens };
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
    async (_, { rejectWithValue }) => {
        try {
            const refreshToken = auth.getRefreshToken();
            if (refreshToken) {
                await authApi.logout(refreshToken);
            }
        } catch (error: any) {
            console.error('Logout API error:', error);
            // Không reject vì chúng ta vẫn muốn clear local state dù API fail
        } finally {
            // Luôn clear tokens
            auth.clearAccessToken();
            auth.clearRefreshToken();
        }
    }
)

// Initialize auth and fetch user info
export const initializeAuth = createAsyncThunk<any>(
    'auth/initialize',
    async (_, { rejectWithValue }) => {
        try {
            const accessToken = auth.getAccessToken();
            const refreshToken = auth.getRefreshToken();
            
            if (!accessToken || !refreshToken) {
                return null;
            }

            // Fetch user info
            const userResponse = await authApi.getMe();
            const user = (userResponse as any).data || userResponse;
            
            return {
                accessToken,
                refreshToken,
                user
            };
        } catch (error: any) {
            // If token is invalid, clear auth
            auth.clearAccessToken();
            auth.clearRefreshToken();
            return rejectWithValue(error.message || 'Failed to initialize auth');
        }
    }
);

export const forgotPassword = createAsyncThunk<
    ApiResponse<{ message: string }>,
    string
>(
    'auth/forgotPassword',
    createAsyncThunkHandler(
        (email: string) => authApi.forgotPassword(email),
        "Gửi email reset password thất bại"
    )
)

export const resetPassword = createAsyncThunk<
    ApiResponse<{ message: string }>,
    { email: string; otpCode: string; newPassword: string; confirmNewPassword: string }
>(
    "auth/resetPassword",
    createAsyncThunkHandler(
        (data) => authApi.resetPassword(data),
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
            authCookies.clearAuthCookies()
        },
        initializeStudentAuth: (state) => {
            const accessToken = auth.getAccessToken()
            const refreshToken = auth.getRefreshToken()
            console.log('🔄 Initializing auth from localStorage:', { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
            if (accessToken && refreshToken) {
                state.accessToken = accessToken;
                state.refreshToken = refreshToken;
                state.isAuthenticated = true;
                console.log('✅ Auth initialized successfully');
            } else {
                console.log('❌ No tokens found in localStorage');
                state.isAuthenticated = false;
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
                state.isLoading = false;
                const data = action.payload.data
                const user = action.payload.user
                if (!data) {
                    state.error = 'Không nhận được dữ liệu từ server';
                    return;
                }
                if (user) {
                    state.student = user;
                    // Set cookies dựa trên role của user
                    const role = user.role || 'student';
                    authCookies.setAuthCookies(role);
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
                state.isLoading = false;
                const data = action.payload.data
                const user = action.payload.user
                if (!data) {
                    state.error = 'Không nhận được dữ liệu từ server';
                    return;
                }
                state.accessToken = data.accessToken;
                state.refreshToken = data.refreshToken;
                if (user) {
                    state.student = user;
                    // Set cookies dựa trên role của user
                    const role = user.role || 'student';
                    authCookies.setAuthCookies(role);
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
                authCookies.clearAuthCookies();
            })
            .addCase(logout.rejected, (state) => {
                state.isLoading = false;
                state.student = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
                authCookies.clearAuthCookies();
            });

        // Initialize auth
        builder
            .addCase(initializeAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.accessToken = action.payload.accessToken;
                    state.refreshToken = action.payload.refreshToken;
                    state.student = action.payload.user;
                    state.isAuthenticated = true;
                    console.log('✅ Auth initialized with user:', action.payload.user);
                } else {
                    state.isAuthenticated = false;
                }
            })
            .addCase(initializeAuth.rejected, (state) => {
                state.isLoading = false;
                state.student = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
            });

            builder
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

            // Reset password with OTP
            builder
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
                state.student = null; // bắt buộc login lại
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearStudentError, setStudentUser, clearStudentAuth, initializeStudentAuth, setStudentAccessToken, setStudentRefreshToken, updateUserAvatar } = authSlice.actions;
export default authSlice.reducer;
