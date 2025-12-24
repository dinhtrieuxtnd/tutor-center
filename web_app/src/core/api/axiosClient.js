import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS, ROUTES } from '../constants';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.group(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log('Base URL:', config.baseURL);
      console.log('Full URL:', `${config.baseURL}${config.url}`);
      console.log('Headers:', config.headers);
      if (config.data) {
        console.log('Body:', config.data);
      }
      if (config.params) {
        console.log('Params:', config.params);
      }
      console.groupEnd();
    }

    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.group(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
      console.log('Status:', response.status, response.statusText);
      console.log('Data:', response.data);
      console.groupEnd();
    }

    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error in development
    if (import.meta.env.DEV) {
      console.group(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      console.error('Status:', error.response?.status);
      console.error('Message:', error.response?.data?.message || error.message);
      console.error('Full Error:', error.response?.data);
      console.groupEnd();
    }

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      // If no refresh token, logout immediately
      if (!refreshToken) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        window.location.href = ROUTES.LOGIN;
        return Promise.reject(error);
      }

      try {
        // Call refresh token API
        const response = await axios.post(
          `${API_BASE_URL}/Auth/refresh-token`,
          { refreshToken },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Update tokens in localStorage
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        // Update Authorization header for the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Log refresh success in development
        if (import.meta.env.DEV) {
          console.log('🔄 Token refreshed successfully');
        }

        // Retry the original request with new token
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed - logout user
        if (import.meta.env.DEV) {
          console.error('❌ Refresh token failed:', refreshError);
        }
        
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        window.location.href = ROUTES.LOGIN;
        
        return Promise.reject(refreshError);
      }
    }

    // Return error with formatted message
    const errorMessage = error.response?.data?.detail
      || error.response?.data?.message 
      || error.response?.data?.title
      || error.message 
      || 'Đã có lỗi xảy ra';

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default axiosClient;
