import config from '../config';

// Types for Quiz (for student view - without correct answers)
export interface QuizForStudentResponse {
  quizId: number;
  title: string;
  description?: string;
  timeLimitSec: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showAnswers: boolean;
  questions: QuizQuestionForStudentResponse[];
}

// Quiz Question for Student (without correct answer info)
export interface QuizQuestionForStudentResponse {
  questionId: number;
  content: string;
  questionType: string;
  points: number;
  orderIndex: number;
  options: QuizOptionForStudentResponse[];
}

// Quiz Option for Student (without isCorrect field)
export interface QuizOptionForStudentResponse {
  questionOptionId: number;
  content: string;
  orderIndex: number;
}

// Types for Quiz Attempt
export interface QuizAttemptResponse {
  quizAttemptId: number;
  lessonId: number;
  quizId: number;
  studentId: number;
  startedAt: string;
  submittedAt?: string;
  status: 'in_progress' | 'submitted' | 'graded';
  scoreRaw?: number;
  scoreScaled10?: number;
}

// Quiz Attempt Detail (with answers and results)
export interface QuizAttemptDetailResponse {
  quizAttemptId: number;
  lessonId: number;
  quizId: number;
  quizTitle: string;
  studentId: number;
  studentName: string;
  startedAt: string;
  submittedAt?: string;
  status: string;
  scoreRaw?: number;
  scoreScaled10?: number;
  answers: QuizAnswerDetailResponse[];
}

// Quiz Answer Detail
export interface QuizAnswerDetailResponse {
  questionId: number;
  questionContent: string;
  questionPoints: number;
  selectedOptionId?: number;
  selectedOptionContent?: string;
  correctOptionId?: number;
  correctOptionContent?: string;
  isCorrect: boolean;
}

// Request DTOs
export interface CreateQuizAttemptRequest {
  lessonId: number;
}

class QuizService {
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
          // Ignore parse errors
        }
      }

      throw new Error(errorMessage);
    }

    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    throw new Error('Unexpected response format');
  }

  /**
   * Get quiz detail for student (without correct answers)
   * Backend: GET /api/Quiz/lesson/{lessonId}/student
   */
  async getQuizForStudent(lessonId: number): Promise<QuizForStudentResponse> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/Quiz/lesson/${lessonId}/student`;

    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers,
    });

    return await this.handleResponse<QuizForStudentResponse>(response);
  }

  /**
   * Create a new quiz attempt for a lesson
   * Backend: POST /api/QuizAttempt
   */
  async createAttempt(lessonId: number): Promise<QuizAttemptResponse> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/QuizAttempt`;

    const body: CreateQuizAttemptRequest = {
      lessonId,
    };

    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    return await this.handleResponse<QuizAttemptResponse>(response);
  }

  /**
   * Get student's quiz attempt for a specific lesson
   * Backend: GET /api/QuizAttempt/lesson/{lessonId}/student
   */
  async getAttemptByLesson(lessonId: number): Promise<QuizAttemptDetailResponse> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/QuizAttempt/lesson/${lessonId}/student`;

    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers,
    });

    return await this.handleResponse<QuizAttemptDetailResponse>(response);
  }

  /**
   * Create/submit an answer for a quiz question
   * Backend: POST /api/QuizAnswer
   */
  async createAnswer(attemptId: number, questionId: number, optionIds: number[]): Promise<{ message: string }> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/QuizAnswer`;

    const body = {
      attemptId,
      questionId,
      optionIds,
    };

    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    return await this.handleResponse<{ message: string }>(response);
  }

  /**
   * Update an existing answer for a quiz question
   * Backend: PUT /api/QuizAnswer
   */
  async updateAnswer(attemptId: number, questionId: number, optionIds: number[]): Promise<{ message: string }> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/QuizAnswer`;

    const body = {
      attemptId,
      questionId,
      optionIds,
    };

    const response = await this.fetchWithTimeout(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    return await this.handleResponse<{ message: string }>(response);
  }

  /**
   * Delete an answer for a quiz question
   * Backend: DELETE /api/QuizAnswer/attempt/{attemptId}/question/{questionId}
   */
  async deleteAnswer(attemptId: number, questionId: number): Promise<{ message: string }> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/QuizAnswer/attempt/${attemptId}/question/${questionId}`;

    const response = await this.fetchWithTimeout(url, {
      method: 'DELETE',
      headers,
    });

    return await this.handleResponse<{ message: string }>(response);
  }
}

export const quizService = new QuizService();
export default quizService;
