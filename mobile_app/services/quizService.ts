import config from '../config';

// Types for Quiz
export interface QuizResponse {
  quizId: number;
  title: string;
  description?: string;
  timeLimitSec: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  gradingMethod: string;
  showAnswers: boolean;
  createdBy: number;
  createdAt: string;
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

// Types for Quiz Question
export interface QuizQuestionResponse {
  questionId: number;
  quizId: number;
  sectionId?: number;
  groupId?: number;
  content: string;
  explanation?: string;
  questionType: string;
  points: number;
  orderIndex: number;
  options: QuizOptionResponse[];
  media?: any[];
}

// Types for Quiz Option
export interface QuizOptionResponse {
  questionOptionId: number;
  questionId: number;
  content: string;
  isCorrect: boolean;
  orderIndex: number;
  media?: any[];
}

// Types for Quiz Detail (from backend)
export interface QuizDetailResponse {
  quizId: number;
  title: string;
  description?: string;
  timeLimitSec: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  gradingMethod: string;
  showAnswers: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  sections: any[];
  questionGroups: any[];
  questions: QuizQuestionResponse[];
}

// Types for Quiz Answer
export interface QuizAnswerResponse {
  attemptId: number;
  questionId: number;
  optionId: number;
}

export interface QuizAnswerDetailResponse {
  questionId: number;
  questionContent: string;
  questionPoints: number;
  optionId: number;
  optionContent: string;
  isCorrect: boolean;
}

// Types for Quiz Attempt Detail
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

// Request DTOs
export interface CreateQuizAnswerRequest {
  questionId: number;
  optionId: number;
}

export interface UpdateQuizAnswerRequest {
  optionId: number;
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
   * Create a new quiz attempt for a lesson
   */
  async createAttempt(lessonId: number): Promise<QuizAttemptResponse> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/QuizAttempts/lessons/${lessonId}`;
    
    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers,
    });
    
    return await this.handleResponse<QuizAttemptResponse>(response);
  }

  /**
   * Get own attempt detail with questions and answers
   */
  async getAttemptDetail(attemptId: number): Promise<QuizAttemptDetailResponse> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/QuizAttempts/${attemptId}`;
    
    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers,
    });
    
    return await this.handleResponse<QuizAttemptDetailResponse>(response);
  }

  /**
   * Create or update an answer for a question in an attempt
   */
  async submitAnswer(
    attemptId: number, 
    questionId: number, 
    optionId: number
  ): Promise<QuizAnswerResponse> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/quiz-attempts/${attemptId}/answers`;
    
    const body: CreateQuizAnswerRequest = {
      questionId,
      optionId,
    };
    
    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    
    return await this.handleResponse<QuizAnswerResponse>(response);
  }

  /**
   * Update an existing answer
   */
  async updateAnswer(
    attemptId: number,
    questionId: number,
    optionId: number
  ): Promise<QuizAnswerResponse> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/quiz-attempts/${attemptId}/answers/${questionId}`;
    
    const body: UpdateQuizAnswerRequest = {
      optionId,
    };
    
    const response = await this.fetchWithTimeout(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    
    return await this.handleResponse<QuizAnswerResponse>(response);
  }

  /**
   * Delete an answer
   */
  async deleteAnswer(attemptId: number, questionId: number): Promise<void> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/quiz-attempts/${attemptId}/answers/${questionId}`;
    
    const response = await this.fetchWithTimeout(url, {
      method: 'DELETE',
      headers,
    });
    
    await this.handleResponse<{ message: string }>(response);
  }

  /**
   * Get quiz detail including questions (use existing GetQuizDetail API)
   */
  async getQuizDetail(quizId: number): Promise<QuizDetailResponse> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/Quizzes/${quizId}`;
    
    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers,
    });
    
    return await this.handleResponse<QuizDetailResponse>(response);
  }
}

export const quizService = new QuizService();
