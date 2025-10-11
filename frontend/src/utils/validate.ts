import { store } from "@/store/store"; // import store gốc
import { addErrorNotification } from "@/store/features/notification/notificationSlice";
import { GRADE } from "@/constants";

// Hàm helper để dispatch error
const showError = (message: string) => {
    store.dispatch(
        addErrorNotification({
            message,
            title: "Lỗi xác thực",
        })
    );
};

/**
 * Validate email - chỉ chấp nhận Gmail
 */
export const validateEmail = (email?: string): boolean => {
    if (!email || !email.trim()) {
        showError("Email không được để trống");
        return false;
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
        showError("Chỉ hỗ trợ email @gmail.com");
        return false;
    }

    return true;
};

/**
 * Validate email for login - sử dụng để xác thực email khi đăng nhập
 */
export const validateUsername = (email: string): boolean => {
    if (!email.trim()) {
        showError("Email không được để trống");
        return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        showError("Email không hợp lệ");
        return false;
    }

    return true;
};

/**
 * Validate password - tối thiểu 6 ký tự
 */
export const validatePassword = (password: string): boolean => {
    if (!password.trim()) {
        showError("Mật khẩu không được để trống");
        return false;
    }
    if (password.length < 6) {
        showError("Mật khẩu phải có ít nhất 6 ký tự");
        return false;
    }

    return true;
};

/**
 * Validate số điện thoại Việt Nam
 * Bắt đầu bằng 0 hoặc +84, theo sau là 9 chữ số
 */
export const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) {
        showError("Số điện thoại không được để trống");
        return false;
    }

    const phoneRegex = /^(0\d{9}|(\+84)\d{9})$/;
    if (!phoneRegex.test(phone)) {
        showError("Số điện thoại không hợp lệ (phải có 10 chữ số và bắt đầu bằng 0 hoặc +84)");
        return false;
    }

    return true;
};

/**
 * Validate họ và tên - không để trống
 */
export const validateName = (firstName: string, lastName: string): boolean => {
    if (!lastName.trim()) {
        showError("Họ không được để trống");
        return false;
    }
    if (!firstName.trim()) {
        showError("Tên không được để trống");
        return false;
    }
    if (lastName.length < 2 || firstName.length < 2) {
        showError("Họ và tên phải có ít nhất 2 ký tự");
        return false;
    }
    return true;
};

/**
 * Validate ngày sinh - phải có, và nhỏ hơn ngày hiện tại
 */
export const validateDateOfBirth = (dateOfBirth?: string): boolean => {
    if (!dateOfBirth) {
        showError("Ngày sinh không được để trống");
        return false;
    }

    // Parse thủ công theo định dạng DD/MM/YYYY
    const parts = dateOfBirth.split("/");
    if (parts.length !== 3) {
        showError("Ngày sinh không hợp lệ");
        return false;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // tháng trong JS bắt đầu từ 0
    const year = parseInt(parts[2], 10);

    const dob = new Date(year, month, day);
    const today = new Date();

    // Check tính hợp lệ: JS có thể tự sửa ngày sai (VD 32/01/2000 -> 01/02/2000)
    if (
        dob.getFullYear() !== year ||
        dob.getMonth() !== month ||
        dob.getDate() !== day
    ) {
        showError("Ngày sinh không hợp lệ");
        return false;
    }

    if (dob >= today) {
        showError("Ngày sinh phải nhỏ hơn ngày hiện tại");
        return false;
    }

    return true;
};

/**
 * Validate lớp/grade - chỉ cho phép 10, 11, 12
 */
export const validateGrade = (grade?: number): boolean => {
    if (!grade) {
        showError("Khối không được để trống");
        return false;
    }
    if (!GRADE.includes(grade)) {
        showError("Khối phải là 10, 11 hoặc 12");
        return false;
    }
    return true;
};

export const validateSchool = (school?: string): boolean => {
    if (!school || !school.trim()) {
        showError("Trường không được để trống");
        return false
    }
    return true
}

/**
 * Validate mật khẩu khớp với confirmPassword
 */
export const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
    if (password !== confirmPassword) {
        showError("Mật khẩu nhập lại không khớp");
        return false;
    }
    return true;
};