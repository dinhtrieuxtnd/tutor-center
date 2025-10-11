// lib/local-keys.ts

/**
 * Danh sách key dùng trong localStorage
 * => chỉ thay đổi ở đây khi cần rename
 */
export const LOCAL_KEYS = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    USER: "user", // nếu bạn muốn lưu thông tin user
    THEME: "theme", // ví dụ: dark/light mode
    REMEMBERME_ACCOUNT:  "remember_account"
}
