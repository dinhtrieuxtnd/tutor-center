import config from '../config';

// Types
export interface JoinRequestResponse {
  joinRequestId: number;
  classroomId: number;
  studentId: number;
  status: 'pending' | 'approved' | 'rejected';
  note?: string | null;
  requestedAt: string;
  handledBy?: number | null;
  handledAt?: string | null;
}

export interface CreateJoinRequestRequest {
  classroomId: number;
  studentId: number;
  note?: string;
}

// Join Request Service
class JoinRequestService {
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

  // Student: Create join request
  async create(data: CreateJoinRequestRequest): Promise<JoinRequestResponse> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/JoinRequests`;
    
    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    const result = await this.handleResponse<{ data: JoinRequestResponse }>(response);
    return result.data;
  }

  // Student: Get my join requests
  async getMy(): Promise<JoinRequestResponse[]> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/JoinRequests/my`;
    
    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers,
    });
    
    return this.handleResponse<JoinRequestResponse[]>(response);
  }
}

export const joinRequestService = new JoinRequestService();
