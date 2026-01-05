import config from '../config';

// Types
export interface ClassroomResponse {
  id: number; // Backend uses 'id', not 'classroomId'
  classroomId?: number; // Keep for backward compatibility
  name: string;
  description?: string;
  tutorId: number;
  tutorName?: string; // Optional, might come from tutor object
  tutor?: {
    userId: number;
    fullName: string;
    email: string;
    avatarUrl?: string;
    avatarMediaId?: number;
  };
  isArchived: boolean;
  studentCount?: number;
  price: number;
  coverMediaId?: number;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface ClassroomQueryRequest {
  q?: string;
  tutorId?: number;
  isArchived?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ClassroomQueryResponse {
  items: ClassroomResponse[];
  total: number;
  page: number;
  pageSize: number;
}

// Classroom Service
class ClassroomService {
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

  // Query all classrooms with filters (for students to browse)
  async query(params?: ClassroomQueryRequest): Promise<ClassroomQueryResponse> {
    const headers = await this.getAuthHeaders();
    const queryString = new URLSearchParams();

    if (params?.q) queryString.append('Q', params.q);
    if (params?.tutorId) queryString.append('TutorId', params.tutorId.toString());
    if (params?.isArchived !== undefined) queryString.append('IsArchived', params.isArchived.toString());
    if (params?.page) queryString.append('Page', params.page.toString());
    if (params?.pageSize) queryString.append('PageSize', params.pageSize.toString());

    const url = `${config.API_BASE_URL}/Classroom${queryString.toString() ? `?${queryString}` : ''}`;

    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<ClassroomQueryResponse>(response);
  }

  // Student: Get my enrolled classrooms
  async getMyEnrollments(): Promise<ClassroomResponse[]> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/Classroom/my-enrollments`;

    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers,
    });

    // Backend returns PageResultDto, extract items
    const result = await this.handleResponse<ClassroomQueryResponse>(response);
    return result.items;
  }

  // Get classroom by ID
  async getById(id: number): Promise<ClassroomResponse> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/Classroom/${id}`;

    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<ClassroomResponse>(response);
  }
}

export const classroomService = new ClassroomService();
