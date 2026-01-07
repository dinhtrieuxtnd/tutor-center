import config from '../config';

// Types
export interface PaymentResponse {
    transactionId: number;
    studentId: number;
    studentName: string;
    classroomId: number;
    classroomName: string;
    amount: number;
    status: 'pending' | 'paid' | 'failed' | 'cancelled';
    paymentMethod: string;
    vnpayTransactionNo?: string;
    vnpayBankCode?: string;
    vnpayCardType?: string;
    momoTransactionId?: string;
    momoPayType?: string;
    orderCode: string;
    createdAt: string;
    paidAt?: string;
}

export interface CreatePaymentRequest {
    classroomId: number;
    paymentMethod: string;
    returnUrl?: string;
}

export interface CreatePaymentResponse {
    transactionId: number;
    orderCode: string;
    paymentUrl: string;
    amount: number;
}

// Payment Service
class PaymentService {
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
     * Create a new payment transaction
     * Backend: POST /api/Payment/create
     */
    async createPayment(data: CreatePaymentRequest): Promise<CreatePaymentResponse> {
        const headers = await this.getAuthHeaders();
        const url = `${config.API_BASE_URL}/Payment/create`;

        const response = await this.fetchWithTimeout(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        return await this.handleResponse<CreatePaymentResponse>(response);
    }

    /**
     * Get all payments for current student
     * Backend: GET /api/Payment/my-payments
     */
    async getMyPayments(): Promise<PaymentResponse[]> {
        const headers = await this.getAuthHeaders();
        const url = `${config.API_BASE_URL}/Payment/my-payments`;

        const response = await this.fetchWithTimeout(url, {
            method: 'GET',
            headers,
        });

        return await this.handleResponse<PaymentResponse[]>(response);
    }

    /**
     * Get payment detail by transaction ID
     * Backend: GET /api/Payment/{transactionId}
     */
    async getPaymentDetail(transactionId: number): Promise<PaymentResponse> {
        const headers = await this.getAuthHeaders();
        const url = `${config.API_BASE_URL}/Payment/${transactionId}`;

        const response = await this.fetchWithTimeout(url, {
            method: 'GET',
            headers,
        });

        return await this.handleResponse<PaymentResponse>(response);
    }
}

export const paymentService = new PaymentService();
export default paymentService;
