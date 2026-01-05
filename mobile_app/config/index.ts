// Configuration file for API endpoints and environment variables

const config = {
  // Backend API configuration
  // ⚠️ QUAN TRỌNG: Thay đổi IP này thành IP máy của bạn trước khi chạy
  // Cách lấy IP:
  // - Windows: Mở CMD và gõ 'ipconfig', tìm IPv4 Address
  // - Mac/Linux: Mở Terminal và gõ 'ifconfig' hoặc 'ip addr'
  // 
  // 💡 PRODUCTION: Thay bằng domain thật
  // API_BASE_URL: 'https://api.tutorcenter.com/api',
  // Backend API endpoint
  // Use 10.0.2.2 for Android Emulator (maps to host's 127.0.0.1)
  // Use 192.168.x.x for real device on same WiFi
  API_BASE_URL: 'http://192.168.1.104:5038/api',

  // Alternative URLs for different environments
  // Local only: 'http://localhost:5293/api' (work trên Android Emulator)
  // Local only: 'http://10.0.2.2:5293/api' (Android Emulator special alias)
  // HTTPS Local: 'https://localhost:7166/api'
  // Production: 'https://your-production-api.com/api'

  // Request timeout
  REQUEST_TIMEOUT: 30000, // 30 seconds - tăng lên để tránh timeout khi mạng chậm

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