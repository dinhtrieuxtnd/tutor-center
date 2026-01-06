import config from '../config';

// Types for Exercise Submission
export interface ExerciseSubmissionResponse {
  exerciseSubmissionId: number;
  lessonId: number;
  exerciseId: number;
  studentId: number;
  studentName?: string;
  mediaId: number;
  submittedAt: string;
  score?: number;
  comment?: string;
  gradedAt?: string;
}

export interface SubmitExerciseRequest {
  lessonId: number;
  exerciseId: number;
  mediaId: number;
}

// Exercise Submission Service
class ExerciseSubmissionService {
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
    
    console.log('📥 Response:', response.status, response.statusText);
    console.log('   Content-Type:', contentType);
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          console.log('   Error Data:', JSON.stringify(errorData, null, 2));
          errorMessage = errorData.detail || errorData.message || errorData.title || errorMessage;
        } catch {
          // Ignore JSON parse error, use default message
        }
      } else {
        try {
          const textData = await response.text();
          console.log('   Error Text:', textData);
        } catch {
          // Ignore
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
   * Submit exercise for a lesson
   */
  async submitExercise(lessonId: number, data: SubmitExerciseRequest): Promise<ExerciseSubmissionResponse> {
    const headers = await this.getAuthHeaders();
    
    console.log('📤 Submit Exercise Request:');
    console.log('  URL:', `${config.API_BASE_URL}/ExerciseSubmissions`);
    console.log('  Body:', JSON.stringify(data, null, 2));
    
    const response = await this.fetchWithTimeout(
      `${config.API_BASE_URL}/ExerciseSubmissions`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }
    );

    return this.handleResponse<ExerciseSubmissionResponse>(response);
  }

  /**
   * Get submission info by submission ID
   */
  async getSubmissionInfo(submissionId: number): Promise<ExerciseSubmissionResponse> {
    const headers = await this.getAuthHeaders();
    const response = await this.fetchWithTimeout(
      `${config.API_BASE_URL}/ExerciseSubmissions/${submissionId}`,
      {
        method: 'GET',
        headers,
      }
    );

    return this.handleResponse<ExerciseSubmissionResponse>(response);
  }

  /**
   * Get submission by lesson ID (for current student)
   */
  async getSubmissionByLesson(lessonId: number): Promise<ExerciseSubmissionResponse | null> {
    const headers = await this.getAuthHeaders();
    
    try {
      const response = await this.fetchWithTimeout(
        `${config.API_BASE_URL}/ExerciseSubmissions/lessons/${lessonId}/my-submission`,
        {
          method: 'GET',
          headers,
        }
      );

      return this.handleResponse<ExerciseSubmissionResponse>(response);
    } catch (error: any) {
      // If 404, no submission found - return null
      if (error.message.includes('404') || error.message.includes('Chưa có bài nộp')) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get all my submissions
   */
  async getMySubmissions(): Promise<ExerciseSubmissionResponse[]> {
    const headers = await this.getAuthHeaders();
    
    try {
      const response = await this.fetchWithTimeout(
        `${config.API_BASE_URL}/ExerciseSubmission/my-submissions`,
        {
          method: 'GET',
          headers,
        }
      );

      return this.handleResponse<ExerciseSubmissionResponse[]>(response);
    } catch (error: any) {
      console.error('Error getting my submissions:', error);
      return [];
    }
  }

  /**
   * Delete submission
   */
  async deleteSubmission(submissionId: number): Promise<void> {
    const headers = await this.getAuthHeaders();
    const response = await this.fetchWithTimeout(
      `${config.API_BASE_URL}/ExerciseSubmissions/${submissionId}`,
      {
        method: 'DELETE',
        headers,
      }
    );

    return this.handleResponse<void>(response);
  }

  /**
   * Upload file to get media ID for submission
   */
  async uploadFile(uri: string, fileName: string, fileType: string): Promise<number> {
    const headers = await this.getAuthHeaders();
    
    // Remove content-type from headers as it will be set by FormData
    const uploadHeaders = { ...headers };
    delete uploadHeaders['Content-Type'];

    const formData = new FormData();
    
    // Create file object for upload
    const file: any = {
      uri,
      name: fileName,
      type: fileType,
    };
    
    formData.append('file', file);

    const response = await this.fetchWithTimeout(
      `${config.API_BASE_URL}/Media/upload`,
      {
        method: 'POST',
        headers: uploadHeaders,
        body: formData,
      }
    );

    const result = await this.handleResponse<{ mediaId: number }>(response);
    return result.mediaId;
  }
}

export const exerciseSubmissionService = new ExerciseSubmissionService();
export default exerciseSubmissionService;
