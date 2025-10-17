// Configuration file for API endpoints and environment variables

const config = {
  // Backend API configuration
  API_BASE_URL: 'http://192.168.1.103:5293/api', // IP thật của máy để mobile có thể connect (cập nhật port từ 5000 -> 5293)
  
  // Alternative URLs for different environments
  // Local only: 'http://localhost:5000/api' (chỉ work trên web)
  // HTTPS Local: 'https://localhost:7299/api'
  // Production: 'https://your-production-api.com/api'
  
  // Request timeout
  REQUEST_TIMEOUT: 10000, // 10 seconds - giảm từ 30s xuống 10s để phản hồi nhanh hơn
  
  // Token storage keys
  ACCESS_TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default config;