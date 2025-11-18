export type Gender = "MALE" | "FEMALE" | "OTHER"
export type UserRole = "student" | "tutor" | "admin"

export interface ImageUrl {
    url: string
    anotherUrl?: string
}

export interface User {
    userId: number
    fullName: string
    email: string
    passwordHash: string
    phoneNumber: string
    role: UserRole
    avatarMediaId?: number
    isActive: boolean
    createdAt: string
    updatedAt: string
}
