import { User } from "./user"

export interface Student extends User {
    studentId: number
    studentPhone?: string
    parentPhone?: string
    grade: number
    school?: string
}
