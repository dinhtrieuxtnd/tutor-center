import config from '../config';

// Types
export interface ChatMessageResponse {
    messageId: number;
    classroomId: number;
    senderId: number;
    senderName: string;
    senderAvatarUrl?: string;
    content: string;
    sentAt: string; // Backend uses sentAt, not createdAt
    isEdited: boolean;
    isDeleted?: boolean;
    media?: any[];
}

export interface SendMessageRequest {
    classroomId: number;
    content: string;
}

export interface EditMessageRequest {
    messageId: number;
    content: string;
}

export interface GetMessagesQuery {
    classroomId: number;
    page?: number;
    pageSize?: number;
}

export interface PageResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

// Chat Service
class ChatService {
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
                    errorMessage = errorData.detail || errorData.message || errorData.title || errorMessage;
                } catch {
                    // Ignore JSON parse error
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
     * Send a message in classroom chat
     * Backend: POST /api/ClassroomChat/messages/send
     */
    async sendMessage(data: SendMessageRequest): Promise<ChatMessageResponse> {
        const headers = await this.getAuthHeaders();
        const url = `${config.API_BASE_URL}/ClassroomChat/messages/send`;

        const response = await this.fetchWithTimeout(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        return await this.handleResponse<ChatMessageResponse>(response);
    }

    /**
     * Get messages in a classroom
     * Backend: GET /api/ClassroomChat/messages
     */
    async getMessages(query: GetMessagesQuery): Promise<PageResult<ChatMessageResponse>> {
        const headers = await this.getAuthHeaders();
        const queryString = new URLSearchParams();

        queryString.append('ClassroomId', query.classroomId.toString());
        if (query.page) queryString.append('Page', query.page.toString());
        if (query.pageSize) queryString.append('PageSize', query.pageSize.toString());

        const url = `${config.API_BASE_URL}/ClassroomChat/messages?${queryString}`;

        const response = await this.fetchWithTimeout(url, {
            method: 'GET',
            headers,
        });

        return await this.handleResponse<PageResult<ChatMessageResponse>>(response);
    }

    /**
     * Edit a message
     * Backend: PUT /api/ClassroomChat/messages/edit
     */
    async editMessage(data: EditMessageRequest): Promise<ChatMessageResponse> {
        const headers = await this.getAuthHeaders();
        const url = `${config.API_BASE_URL}/ClassroomChat/messages/edit`;

        const response = await this.fetchWithTimeout(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });

        return await this.handleResponse<ChatMessageResponse>(response);
    }

    /**
     * Delete a message
     * Backend: DELETE /api/ClassroomChat/messages/{messageId}
     */
    async deleteMessage(messageId: number): Promise<void> {
        const headers = await this.getAuthHeaders();
        const url = `${config.API_BASE_URL}/ClassroomChat/messages/${messageId}`;

        const response = await this.fetchWithTimeout(url, {
            method: 'DELETE',
            headers,
        });

        await this.handleResponse<{ message: string }>(response);
    }
}

export const chatService = new ChatService();
export default chatService;
