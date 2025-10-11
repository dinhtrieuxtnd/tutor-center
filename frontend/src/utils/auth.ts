// lib/auth.ts
import { LOCAL_KEYS } from "../constants/local-keys"

export const auth = {
    getAccessToken: () =>
        typeof window !== "undefined" ? localStorage.getItem(LOCAL_KEYS.ACCESS_TOKEN) : null,

    setAccessToken: (token: string) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_KEYS.ACCESS_TOKEN, token)
        }
    },

    clearAccessToken: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(LOCAL_KEYS.ACCESS_TOKEN)
        }
    },

    getRefreshToken: () =>
        typeof window !== "undefined" ? localStorage.getItem(LOCAL_KEYS.REFRESH_TOKEN) : null,

    setRefreshToken: (token: string) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_KEYS.REFRESH_TOKEN, token)
        }
    },

    clearRefreshToken: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(LOCAL_KEYS.REFRESH_TOKEN)
        }
    },

    clearAll: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(LOCAL_KEYS.ACCESS_TOKEN)
            localStorage.removeItem(LOCAL_KEYS.REFRESH_TOKEN)
        }
    },
}
