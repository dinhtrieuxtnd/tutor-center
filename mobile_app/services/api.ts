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
  phone?: string;
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
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Kết nối mạng quá chậm, vui lòng thử lại');
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

  async register(registerData: RegisterRequest): Promise<AuthTokens> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/Auth/register`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
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

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([config.ACCESS_TOKEN_KEY, config.REFRESH_TOKEN_KEY]);
    } catch (error) {
      console.error('Logout error:', error);
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
      const response = await this.fetchWithTimeout(`${this.baseURL}/Auth/me`, {
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