import config from '../config';

// Types
export interface ProfileResponse {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber: string;
  avatarMediaId?: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Profile Service
class ProfileService {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    const token = await AsyncStorage.getItem(config.ACCESS_TOKEN_KEY);
    return {
      ...config.DEFAULT_HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
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
        throw new Error(`Kết nối đến server quá chậm. Vui lòng thử lại.`);
      }
      
      if (error.message.includes('Network request failed')) {
        throw new Error(`Không thể kết nối đến server.`);
      }
      
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await this.fetchWithTimeout(`${config.API_BASE_URL}/Profile/me`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể lấy thông tin người dùng');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<void> {
    try {
      const response = await this.fetchWithTimeout(`${config.API_BASE_URL}/Profile/update`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể cập nhật thông tin');
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      const response = await this.fetchWithTimeout(`${config.API_BASE_URL}/Profile/change-password`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể đổi mật khẩu');
      }
    } catch (error: any) {
      console.error('Change password error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
      throw error;
    }
  }
}

export const profileService = new ProfileService();
export default profileService;
