import AsyncStorage from '@react-native-async-storage/async-storage';
// import AsyncStorage from '../utils/mockAsyncStorage'; // Mock cho development
import config from '../config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  otpCode: string;
}

export interface SendOtpRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  tokenType: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.API_BASE_URL;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem(config.ACCESS_TOKEN_KEY);
    return {
      ...config.DEFAULT_HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.title || errorMessage;
        } catch {
          // Ignore JSON parse error, use default message
        }
      }

      throw new Error(errorMessage);
    }

    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return {} as T;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.REQUEST_TIMEOUT);

    console.log('🌐 API Request:', url);
    console.log('📤 Request options:', JSON.stringify(options, null, 2));

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      console.log('✅ Response status:', response.status);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('❌ Fetch error:', error);

      if (error.name === 'AbortError') {
        throw new Error(
          `Kết nối đến server quá chậm (timeout ${config.REQUEST_TIMEOUT / 1000}s).\n` +
          `Kiểm tra:\n` +
          `1. Backend đã chạy chưa?\n` +
          `2. IP trong config có đúng không? (${config.API_BASE_URL})`
        );
      }

      if (error.message.includes('Network request failed')) {
        throw new Error(
          `Không thể kết nối đến server.\n` +
          `Kiểm tra:\n` +
          `1. Backend đã chạy ở ${config.API_BASE_URL}?\n` +
          `2. IP có đúng không? (Windows: ipconfig, Mac: ifconfig)\n` +
          `3. Firewall có chặn không?\n` +
          `4. Cùng mạng WiFi với máy chạy backend?`
        );
      }

      throw error;
    }
  }

  // Auth endpoints
  async login(loginData: LoginRequest): Promise<AuthTokens> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/Auth/login`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(loginData),
      });

      const result = await this.handleResponse<AuthTokens>(response);

      // Lưu tokens vào AsyncStorage
      if (result.accessToken) {
        await AsyncStorage.setItem(config.ACCESS_TOKEN_KEY, result.accessToken);
        await AsyncStorage.setItem(config.REFRESH_TOKEN_KEY, result.refreshToken);
      }

      return result;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
      throw error;
    }
  }

  async sendOtpRegister(data: SendOtpRequest): Promise<{ message: string }> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/Auth/send-otp-register`, {
        method: 'POST',
        headers: config.DEFAULT_HEADERS,
        body: JSON.stringify(data),
      });

      const result = await this.handleResponse<{ message: string }>(response);
      return result;
    } catch (error: any) {
      console.error('Send OTP error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
      throw error;
    }
  }

  async register(registerData: RegisterRequest): Promise<AuthTokens> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/Auth/register`, {
        method: 'POST',
        headers: config.DEFAULT_HEADERS,
        body: JSON.stringify(registerData),
      });

      const result = await this.handleResponse<AuthTokens>(response);

      // Lưu tokens vào AsyncStorage
      if (result.accessToken) {
        await AsyncStorage.setItem(config.ACCESS_TOKEN_KEY, result.accessToken);
        await AsyncStorage.setItem(config.REFRESH_TOKEN_KEY, result.refreshToken);
      }

      return result;
    } catch (error: any) {
      console.error('Register error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
      throw error;
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/Auth/forgot-password`, {
        method: 'POST',
        headers: config.DEFAULT_HEADERS,
        body: JSON.stringify(data),
      });

      const result = await this.handleResponse<{ message: string }>(response);
      return result;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/Auth/reset-password`, {
        method: 'PUT',
        headers: config.DEFAULT_HEADERS,
        body: JSON.stringify(data),
      });

      const result = await this.handleResponse<{ message: string }>(response);
      return result;
    } catch (error: any) {
      console.error('Reset password error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Get refresh token before clearing storage
      const refreshToken = await AsyncStorage.getItem(config.REFRESH_TOKEN_KEY);

      // Call backend logout API if we have a refresh token
      if (refreshToken) {
        try {
          await this.fetchWithTimeout(`${this.baseURL}/Auth/logout`, {
            method: 'DELETE',
            headers: await this.getAuthHeaders(),
            body: JSON.stringify({ refreshToken }),
          });
        } catch (error) {
          // Continue with local logout even if API call fails
          console.error('Backend logout error:', error);
        }
      }

      // Clear local tokens
      await AsyncStorage.multiRemove([config.ACCESS_TOKEN_KEY, config.REFRESH_TOKEN_KEY]);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<AuthTokens | null> {
    try {
      const refreshToken = await AsyncStorage.getItem(config.REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        return null;
      }

      const response = await this.fetchWithTimeout(`${this.baseURL}/Auth/refresh`, {
        method: 'POST',
        headers: config.DEFAULT_HEADERS,
        body: JSON.stringify({ refreshToken }),
      });

      const result = await this.handleResponse<AuthTokens>(response);

      // Cập nhật tokens mới
      if (result.accessToken) {
        await AsyncStorage.setItem(config.ACCESS_TOKEN_KEY, result.accessToken);
        await AsyncStorage.setItem(config.REFRESH_TOKEN_KEY, result.refreshToken);
      }

      return result;
    } catch (error) {
      console.error('Refresh token error:', error);
      // Xóa tokens cũ nếu refresh thất bại
      await AsyncStorage.multiRemove([config.ACCESS_TOKEN_KEY, config.REFRESH_TOKEN_KEY]);
      return null;
    }
  }

  async getMe(): Promise<any> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/Profile`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get me error:', error);
      throw error;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(config.ACCESS_TOKEN_KEY);
    return !!token;
  }
}

export const apiService = new ApiService();
export default apiService;