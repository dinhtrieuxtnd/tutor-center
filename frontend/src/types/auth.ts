import {
    Student,
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
  username: string;
  email?: string;
  gender?: GENDER;
  dateOfBirth?: Date;
  password: string;
  firstName: string;
  lastName: string;
  studentPhone?: string;
  grade?: number;
  school?: string;
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
    user: Student
}


// Auth State
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface StudentAuthState extends AuthState {
    student: Student | null
}

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


