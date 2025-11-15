# Các giao diện chung:
## Giao diện đăng nhập
- auth/login
- gồm input email, input password
## Giao diện đăng ký
- auth/register
- gồm:
    - input fullName
    - input email
    - nút Gửi OTP bên cạnh input email
    - input mã OTP
    - input password
    - input confirmPassword
## Giao diện quên mật khẩu
- auth/forgot-password
- gồm:
    - input email
    - nút Gửi OTP bên cạnh input email
    - input mã OTP
    - input newPassword
    - input confirmNewPassword
## Header sau khi đăng nhập
- Logo, thanh tìm kiếm, dropdown menu

## Profile
- profile: 2 tab, tab quản lý thông tin và tab bảo mật

# Giao diện dashboard
## student
- sidebar: chung cho mọi giao diện student
    - trang chủ, lớp học, tin nhắn
- student/dashboard: sử dụng dữ liệu tạm thời
    - 2 biểu đồ gì đó (tùy)
    - Thống kê số lớp học tham gia, bài tập đã nộp, bài kiểm tra đã làm
    - Thông báo từ các lớp học đã tham gia

## tutor
- sidebar: chung cho mọi giao diện tutor
    - trang chủ
    - quản lý lớp học
    - quản lý bài giảng
    - quản lý bài tập
    - quản lý bài kiểm tra
    - quản lý thông báo
- tutor/dashboard: sử dụng dữ liệu tạm thời
    - 2 biểu đồ gì đó (tùy)
    - Thống kê số lớp học, bài giảng, bài tập, bài kiểm tra của bản thân
    - Thông báo từ các lớp học của bản thân

## admin
- sidebar: chung cho mọi giao diện admin
    - trang chủ
    - quản lý lớp học
    - quản lý gia sư
    - quản lý học sinh
    - quản lý báo cáo (report)
- admin/dashboard: sử dụng dữ liệu tạm thời
    - 2 biểu đồ gì đó (tùy)
    - Thống kê số lớp học, gia sư học sinh
    - ActivityLogs