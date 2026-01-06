import config from '../config';

// Backend Response Types (as returned from API)
interface QuizBackendResponse {
  id: number;
  title: string;
  description?: string;
  timeLimitSec: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showAnswers?: boolean;
  questions: QuizQuestionBackendResponse[];
}

interface QuizQuestionBackendResponse {
  id: number;
  content: string;
  questionType: string;
  points: number;
  orderIndex: number;
  options: QuizOptionBackendResponse[];
}

interface QuizOptionBackendResponse {
  id: number;
  content: string;
  orderIndex: number;
}

// Frontend Types (normalized for app use)
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

export interface QuizQuestionForStudentResponse {
  questionId: number;
  content: string;
  questionType: string;
  points: number;
  orderIndex: number;
  options: QuizOptionForStudentResponse[];
}

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

// Backend response for quiz attempt detail (actual structure)
interface QuizAttemptBackendDetailResponse {
  quizAttemptId: number;
  lessonId: number;
  quizId: number;
  studentId: number;
  studentName: string;
  startedAt: string;
  submittedAt?: string;
  status: string;
  scoreRaw?: number;
  scoreScaled10?: number;
  quiz: {
    id: number;
    title: string;
    questions: Array<{
      id: number;
      content: string;
      points: number;
      options: Array<{
        id: number;
        content: string;
        isCorrect: boolean;
      }>;
    }>;
  };
  answers: Array<{
    attemptId: number;
    questionId: number;
    optionId: number;
  }>;
}

// Frontend transformed quiz attempt detail
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
  // In-memory cache for quiz data
  private quizCache: Map<number, { data: QuizForStudentResponse; timestamp: number }> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

  /**
   * Clear cache for a specific lesson or all lessons
   */
  clearCache(lessonId?: number): void {
    if (lessonId) {
      this.quizCache.delete(lessonId);
      console.log('🗑️ Cleared cache for lesson:', lessonId);
    } else {
      this.quizCache.clear();
      console.log('🗑️ Cleared all quiz cache');
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

  // Transform attempt detail from backend to frontend format
  private transformAttemptDetail(backendData: QuizAttemptBackendDetailResponse): QuizAttemptDetailResponse {
    const answers: QuizAnswerDetailResponse[] = backendData.answers.map(ans => {
      const question = backendData.quiz.questions.find(q => q.id === ans.questionId);
      const selectedOption = question?.options.find(opt => opt.id === ans.optionId);
      const correctOption = question?.options.find(opt => opt.isCorrect);

      return {
        questionId: ans.questionId,
        questionContent: question?.content || '',
        questionPoints: question?.points || 0,
        selectedOptionId: ans.optionId,
        selectedOptionContent: selectedOption?.content || '',
        correctOptionId: correctOption?.id,
        correctOptionContent: correctOption?.content || '',
        isCorrect: selectedOption?.isCorrect || false,
      };
    });

    return {
      quizAttemptId: backendData.quizAttemptId,
      lessonId: backendData.lessonId,
      quizId: backendData.quizId,
      quizTitle: backendData.quiz.title,
      studentId: backendData.studentId,
      studentName: backendData.studentName,
      startedAt: backendData.startedAt,
      submittedAt: backendData.submittedAt,
      status: backendData.status,
      scoreRaw: backendData.scoreRaw,
      scoreScaled10: backendData.scoreScaled10,
      answers,
    };
  }

  // Transform backend response to frontend format
  private transformQuizData(backendData: QuizBackendResponse): QuizForStudentResponse {
    return {
      quizId: backendData.id,
      title: backendData.title,
      description: backendData.description,
      timeLimitSec: backendData.timeLimitSec,
      maxAttempts: backendData.maxAttempts,
      shuffleQuestions: backendData.shuffleQuestions,
      shuffleOptions: backendData.shuffleOptions,
      showAnswers: backendData.showAnswers || false,
      questions: backendData.questions.map(q => ({
        questionId: q.id,
        content: q.content,
        questionType: q.questionType,
        points: q.points,
        orderIndex: q.orderIndex,
        options: q.options.map(opt => ({
          questionOptionId: opt.id,
          content: opt.content,
          orderIndex: opt.orderIndex,
        })),
      })),
    };
  }

  /**
   * Get quiz detail for student (without correct answers)
   * Backend: GET /api/Quiz/lesson/{lessonId}/student
   * With caching to improve performance
   */
  async getQuizForStudent(lessonId: number, forceRefresh = false): Promise<QuizForStudentResponse> {
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = this.quizCache.get(lessonId);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log('📦 Using cached quiz data for lesson:', lessonId);
        return cached.data;
      }
    }

    console.log('🌐 Fetching quiz data from server for lesson:', lessonId);
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/Quiz/lesson/${lessonId}/student`;

    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers,
    });

    const backendData = await this.handleResponse<QuizBackendResponse>(response);
    const transformedData = this.transformQuizData(backendData);

    // Cache the result
    this.quizCache.set(lessonId, {
      data: transformedData,
      timestamp: Date.now(),
    });

    return transformedData;
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

    const backendData = await this.handleResponse<QuizAttemptBackendDetailResponse>(response);
    return this.transformAttemptDetail(backendData);
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

  /**
   * Submit quiz attempt
   * Backend: PUT /api/QuizAttempt/submit
   */
  async submitAttempt(lessonId: number): Promise<QuizAttemptResponse> {
    const headers = await this.getAuthHeaders();
    const url = `${config.API_BASE_URL}/QuizAttempt/submit`;

    const body = {
      lessonId,
    };

    const response = await this.fetchWithTimeout(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    return await this.handleResponse<QuizAttemptResponse>(response);
  }
}

export const quizService = new QuizService();
export default quizService;
