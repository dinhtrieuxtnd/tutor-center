import {
    User,
} from '@/types'
import { GENDER } from '@/constants'

// Request khi login
export interface LoginRequest {
    username?: string
    email?: string
    password: string
    userAgent?: string
    ipAddress?: string
    deviceFingerprint?: string
}

export interface RegisterStudentRequest {
  email: string;
  otpCode: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export interface SendOtpRegisterRequest {
  email: string;
}

// Token payload backend trả về
export interface Tokens {
    accessToken: string
    refreshToken: string
    expiresIn: number
}

// Login response trả về sau khi đăng nhập
export interface LoginResponse {
    tokens: Tokens
    user: User
}


// Auth State
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// UserAuthState - used for all roles (student, tutor, admin)
export interface UserAuthState extends AuthState {
    user: User | null
}

// Legacy alias for backward compatibility
export type StudentAuthState = UserAuthState;

// Role Types
export interface Role {
  roleId: number;
  roleName: string;
  description?: string;
  isAssignable: boolean;
  requiredByRoleId?: number;
  createdAt: string;
}

export interface UserRole {
  userId: number;
  roleId: number;
  assignedAt: string;
  expiresAt?: string;
  assignedBy?: number;
  isActive: boolean;
}

// Token Types
export interface UserRefreshToken {
  tokenId: number;
  userId: number;
  familyId: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
  lastUsedAt?: string;
  revokedAt?: string;
  replacedByTokenId?: number;
  userAgent?: string;
  ipAddress?: string;
  deviceFingerprint?: string;
}


