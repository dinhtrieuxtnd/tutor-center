export type Gender = "MALE" | "FEMALE" | "OTHER"

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
}
