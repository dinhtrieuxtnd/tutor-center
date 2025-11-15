// Cookie helpers cho authentication middleware
import { UserRole } from "@/types"

export const authCookies = {
    setAuthCookies: (role: UserRole) => {
        if (typeof document !== "undefined") {
            // Set cookie với thời hạn 7 ngày
            const expires = new Date()
            expires.setDate(expires.getDate() + 7)
            
            document.cookie = `hasAuth=true; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
            document.cookie = `userRole=${role}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
        }
    },
    
    clearAuthCookies: () => {
        if (typeof document !== "undefined") {
            // Xóa cookies bằng cách set expire date về quá khứ
            document.cookie = "hasAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
            document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        }
    },
    
    getAuthCookies: () => {
        if (typeof document !== "undefined") {
            const cookies = document.cookie.split(";").reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split("=")
                acc[key] = value
                return acc
            }, {} as Record<string, string>)
            
            return {
                hasAuth: cookies.hasAuth === "true",
                userRole: cookies.userRole as UserRole | undefined
            }
        }
        return { hasAuth: false, userRole: undefined }
    }
}
