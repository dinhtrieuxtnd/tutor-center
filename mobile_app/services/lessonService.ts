import config from '../config';

// Types for Lecture
export interface LectureResponse {
  lectureId: number;
  title: string;
  content?: string;
  parentId?: number;
  uploadedBy: number;
  uploadedByName: string;
  uploadedAt?: string;
  createdAt: string;
  mediaId?: number;
  children?: LectureResponse[];
}

// Types for Exercise
export interface ExerciseResponse {
  exerciseId: number;
  title: string;
  description?: string;
  uploadedBy: number;
  uploadedByName: string;
  createdAt: string;
}

// Types for Quiz
export interface QuizResponse {
  quizId: number;
  title: string;
  description?: string;
  uploadedBy: number;
  uploadedByName: string;
  timeLimit?: number;
  createdAt: string;
}

// Lesson Response
export interface LessonResponse {
  lessonId: number;
  classroomId: number;
  lessonType: 'lecture' | 'exercise' | 'quiz';
  orderIndex: number;
  createdAt: string;
  lecture: LectureResponse | null;
  exercise: ExerciseResponse | null;
  exerciseDueAt: string | null;
  quiz: QuizResponse | null;
  quizStartAt: string | null;
  quizEndAt: string | null;
}

// Lesson Service
class LessonService {
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

  // Get lessons by classroom
  async getByClassroom(classroomId: number): Promise<LessonResponse[]> {
    const headers = await this.getAuthHeaders();
    const response = await this.fetchWithTimeout(
      `${config.API_BASE_URL}/Lesson/classroom/${classroomId}`,
      {
        method: 'GET',
        headers,
      }
    );

    const data = await this.handleResponse<any[]>(response);
    
    // Map backend response (Id) to frontend format (lessonId)
    return data.map((lesson) => ({
      ...lesson,
      lessonId: lesson.id || lesson.lessonId || lesson.Id,
    }));
  }
}

export const lessonService = new LessonService();
export default lessonService;
