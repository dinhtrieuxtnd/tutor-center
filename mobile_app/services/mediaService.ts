import config from '../config';
import * as FileSystem from 'expo-file-system';

export interface MediaPresignedUrlResponse {
  url: string;
  mimeType?: string;
}

class MediaService {
  /**
   * Fix localhost URLs to use actual IP address
   * This is needed because MinIO presigned URLs may contain localhost
   * which is not accessible from mobile devices
   */
  private fixUrl(url: string): string {
    // Replace localhost and 127.0.0.1 with actual IP
    const fixedUrl = url
      .replace('http://localhost:', 'http://192.168.123.2:')
      .replace('http://127.0.0.1:', 'http://192.168.123.2:')
      .replace('https://localhost:', 'http://192.168.123.2:')
      .replace('https://127.0.0.1:', 'http://192.168.123.2:');

    // URL fixed automatically if needed

    return fixedUrl;
  }

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

      if (error.message === 'Network request failed') {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }

      throw error;
    }
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

    if (response.status === 204) {
      return {} as T;
    }

    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return {} as T;
  }

  /**
   * Get presigned URL for media file
   */
  async getPresignedUrl(mediaId: number | string): Promise<MediaPresignedUrlResponse> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/media/${mediaId}/presigned`;

    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers,
    });

    const result = await this.handleResponse<MediaPresignedUrlResponse>(response);

    // Fix localhost URLs to use actual IP
    if (result.url) {
      result.url = this.fixUrl(result.url);
    }

    return result;
  }

  /**
   * Get view URL for media file (proxied through backend for better compatibility)
   * Returns URL with token in query string so it works with external viewers like Google Docs
   */
  async getViewUrl(mediaId: number | string): Promise<string> {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    const token = await AsyncStorage.getItem(config.ACCESS_TOKEN_KEY);

    // Return backend view URL with token in query string
    return `${config.API_BASE_URL}/media/${mediaId}/view?token=${encodeURIComponent(token || '')}`;
  }

  /**
   * Delete media file
   */
  async deleteMedia(mediaId: number | string): Promise<void> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/media/${mediaId}`;

    const response = await this.fetchWithTimeout(url, {
      method: 'DELETE',
      headers,
    });

    return this.handleResponse<void>(response);
  }

  /**
   * Download media file to device
   */
  async downloadMedia(mediaId: number | string, fileName?: string): Promise<string> {
    try {
      // Get presigned URL (already fixed by getPresignedUrl method)
      const { url } = await this.getPresignedUrl(mediaId);

      // Return the fixed presigned URL for direct use
      return url;
    } catch (error: any) {
      console.error('Error getting media URL:', error);
      throw new Error(error.message || 'Không thể lấy link tài liệu');
    }
  }
}

export const mediaService = new MediaService();
