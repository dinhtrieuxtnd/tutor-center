export type Gender = "MALE" | "FEMALE" | "OTHER"
export type UserRole = "student" | "tutor" | "admin"

export interface ImageUrl {
    url: string
    anotherUrl?: string
}

export interface User {
    userId: number
    username: string
    email?: string
    firstName: string
    lastName: string
    fullName: string
    gender?: Gender
    dateOfBirth?: string // backend trả Date → FE nhận string (ISO format)
    isActive: boolean
    isEmailVerified: boolean
    imageUrls?: ImageUrl
    emailVerifiedAt?: string
    lastLoginAt?: string
    createdAt: string
    updatedAt: string
    role?: UserRole // Role của user để xác định quyền truy cập
}
