# Báo cáo đề tài: Hệ thống Web + App Trung Tâm Gia Sư

## 1. Giới thiệu

### 1.1 Mục đích
Tài liệu này mô tả chi tiết các yêu cầu của hệ thống nền tảng web + app quản lý và tổ chức lớp học trực tuyến cho trung tâm gia sư. Hệ thống được phát triển theo **mô hình thác nước**.

### 1.2 Phạm vi
Hệ thống hỗ trợ:

- **Quản trị viên**: quản lý tài khoản, lớp học, phân quyền và theo dõi hoạt động.  
- **Gia sư (giáo viên)**: quản lý bài giảng, tài liệu, bài tập, đề kiểm tra.  
- **Học sinh**: đăng ký tài khoản, gửi yêu cầu tham gia lớp học, truy cập tài liệu, làm bài tập/kiểm tra, xem kết quả.

### 1.3 Đối tượng sử dụng
- Quản trị viên  
- Gia sư  
- Học sinh  

---

## 2. Mô tả tổng quan

### 2.1 Góc nhìn hệ thống
Ứng dụng web + mobile đa vai trò với 3 loại tài khoản:

- Học sinh **tự tạo tài khoản**, nhưng quyền vào lớp phải được **gia sư duyệt**.  
- Gia sư **do Admin cấp tài khoản**.

### 2.2 Chức năng chính
- Quản lý tài khoản & phân quyền  
- Quản lý lớp học (Admin chịu trách nhiệm tạo/sửa/xóa)  
- Quản lý bài giảng, tài liệu, bài tập, kiểm tra  
- Yêu cầu tham gia lớp học & phê duyệt  
- Quản lý hồ sơ cá nhân (Profile Management)  
- Thông báo và lịch học  
- Thanh toán online & báo cáo thống kê  

### 2.3 Đặc điểm người dùng
| Vai trò | Mô tả |
|----------|--------|
| **Admin** | Quyền cao nhất, cấp tài khoản cho gia sư, quản lý lớp học |
| **Gia sư** | Giảng dạy, quản lý nội dung trong lớp, xét duyệt học sinh |
| **Học sinh** | Đăng ký tài khoản, gửi yêu cầu tham gia lớp |

---

## 3. Yêu cầu chức năng

### 3.1 Quản trị viên
- Tạo, quản lý tài khoản gia sư  
- Quản lý lớp học (CRUD)  
- Quản lý toàn bộ người dùng & báo cáo hệ thống  
- Quản lý thanh toán & thống kê  

### 3.2 Gia sư
- Quản lý bài giảng, tài liệu, bài tập, đề kiểm tra  
- Quản lý yêu cầu tham gia lớp học (chấp nhận hoặc từ chối)  
- Chấm điểm, nhận xét  
- Quản lý lịch dạy và thông báo  

### 3.3 Học sinh
- Đăng ký tài khoản  
- Đăng nhập, cập nhật hồ sơ cá nhân (profile), quên mật khẩu  
- Gửi yêu cầu tham gia lớp học  
- Sau khi được phê duyệt: xem tài liệu, làm bài tập, làm kiểm tra  
- Xem điểm và tiến độ học tập  
- Thanh toán học phí online  

### 3.4 Chức năng mở rộng
- Chat/diễn đàn trong lớp (realtime)  
- Thông báo & nhắc nhở  
- Lịch học  
- AI Chatbot hỗ trợ gia sư soạn giáo án  
- Báo cáo thống kê kết quả học tập  

---

## 4. Yêu cầu phi chức năng

| Thuộc tính | Mô tả |
|-------------|--------|
| **Bảo mật** | Phân quyền rõ ràng, xác thực an toàn (JWT/OAuth2) |
| **Hiệu năng** | Hệ thống phục vụ tối thiểu 200 người dùng đồng thời |
| **Khả năng mở rộng** | Có thể thêm module mới mà không ảnh hưởng hệ thống cũ |
| **Khả năng sử dụng** | Giao diện thân thiện, hỗ trợ responsive |

---

## 5. Mô hình dữ liệu sơ bộ

| Bảng | Thuộc tính |
|------|-------------|
| **Users** | id, name, email, hashed_password, role_id, profile_info |
| **Classrooms** | id, title, description, teacher_id |
| **Lessons** | id, title, content, classroom_id, type |
| **Exercises** | id, title, file_url, classroom_id |
| **Submissions** | id, exercise_id, student_id, file_url, score |
| **JoinRequests** | id, student_id, classroom_id, status: pending/accepted/denied |
| **Roles** | id, name |
| **Permissions** | id, title, content, classroom_id |
| **Payments** | id, user_id, amount, method, status, created_at |
| **Reports** | id, type, data, created_at |

---

## 6. Công nghệ sử dụng

| Thành phần | Công nghệ |
|-------------|------------|
| **Backend** | ASP.NET Core |
| **Frontend (Web)** | NextJS |
| **Frontend (Mobile)** | React Native |
| **CSDL** | SQL Server |
| **Realtime chat** | Socket.IO |
| **AI Chatbot** | Tích hợp mô hình DeepSeek |
| **Thanh toán online** | Tích hợp MoMo / PayPal / VNPay |
