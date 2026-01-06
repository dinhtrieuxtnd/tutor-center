import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

interface User {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, confirmPassword: string, phoneNumber: string, otpCode: string) => Promise<void>;
  sendOtpRegister: (email: string) => Promise<{ message: string }>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (email: string, otpCode: string, newPassword: string, confirmNewPassword: string) => Promise<{ message: string }>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authenticated = await apiService.isAuthenticated();
      
      console.log('🔐 Checking auth status...', { authenticated });
      
      if (authenticated) {
        // Try to get user data
        try {
          console.log('📱 Getting user data...');
          const userData = await apiService.getMe();
          console.log('✅ User data loaded:', userData);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error: any) {
          console.log('⚠️ Failed to get user data, attempting token refresh...', error.message);
          // Token might be expired, the apiService will automatically try to refresh
          // If refresh fails, it will throw an error
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('❌ No stored token found');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await apiService.login({ email, password });
      
      if (result.accessToken) {
        // Get user data after successful login
        const userData = await apiService.getMe();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
    phoneNumber: string,
    otpCode: string
  ) => {
    try {
      const result = await apiService.register({
        fullName,
        email,
        password,
        confirmPassword,
        phoneNumber,
        otpCode,
      });
      
      if (result.accessToken) {
        // Get user data after successful registration
        const userData = await apiService.getMe();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      throw error;
    }
  };

  const sendOtpRegister = async (email: string): Promise<{ message: string }> => {
    try {
      return await apiService.sendOtpRegister({ email });
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email: string): Promise<{ message: string }> => {
    try {
      return await apiService.forgotPassword({ email });
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (
    email: string,
    otpCode: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<{ message: string }> => {
    try {
      return await apiService.resetPassword({
        email,
        otpCode,
        newPassword,
        confirmNewPassword,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUserData = async () => {
    try {
      if (isAuthenticated) {
        const userData = await apiService.getMe();
        setUser(userData);
      }
    } catch (error) {
      console.error('Refresh user data error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    sendOtpRegister,
    forgotPassword,
    resetPassword,
    logout,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;