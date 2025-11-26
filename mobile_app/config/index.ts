// Configuration file for API endpoints and environment variables

const config = {
  // Backend API configuration
  // ⚠️ QUAN TRỌNG: Thay đổi IP này thành IP máy của bạn
  // Cách lấy IP:
  // - Windows: Mở CMD và gõ 'ipconfig', tìm IPv4 Address
  // - Mac/Linux: Mở Terminal và gõ 'ifconfig' hoặc 'ip addr'
  // - Hoặc dùng: http://localhost:5293/api nếu test trên emulator Android
  // 
  // 💡 TIP: Nếu máy có nhiều IP, ưu tiên dùng IP WiFi (192.168.x.x)
  // - 192.168.123.2 = WiFi/Ethernet (KHUYẾN NGHỊ cho điện thoại thật)
  // - 172.21.224.1 = Virtual network (WSL/Docker/VPN)
  // - 172.20.10.8 = Your current WiFi/Network IP
  API_BASE_URL: 'http://172.20.10.8:5293/api',
  
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