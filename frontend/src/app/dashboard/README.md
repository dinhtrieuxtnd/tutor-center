# Dashboard - Hệ thống Trung tâm Gia sư Bee

## 📋 Tổng quan

Dashboard được thiết kế với **3 giao diện khác nhau** tùy theo vai trò người dùng:
- 👨‍💼 **Admin**: Quản lý toàn hệ thống
- 👨‍🏫 **Teacher (Giáo viên)**: Quản lý lớp học và học sinh
- 👨‍🎓 **Student (Học sinh)**: Xem lớp học và làm bài tập

## 🎨 Thiết kế UI/UX

### 1. Navigation Bar (Top)
- Logo Bee với icon ong vàng 🐝
- Menu điều hướng: Dashboard, Lớp học, Tin nhắn
- Thông báo với badge (đỏ)
- Avatar người dùng với tên và vai trò
- Nút đăng xuất

### 2. Welcome Section
- Lời chào động (sáng/chiều/tối)
- Tên người dùng
- Mô tả vai trò

### 3. Stats Cards (4 thẻ thống kê)

#### Admin Dashboard:
- 📚 Tổng lớp học (màu xanh dương)
- 👥 Tổng học sinh (màu xanh lá)
- 👔 Tổng giáo viên (màu tím)
- 💰 Doanh thu tháng (màu vàng)

#### Teacher Dashboard:
- 📚 Lớp học của tôi (màu xanh dương)
- 👥 Tổng học sinh (màu xanh lá)
- ⏰ Yêu cầu chờ duyệt (màu cam) - có badge cảnh báo
- ✅ Bài tập chờ chấm (màu tím)

#### Student Dashboard:
- 📚 Lớp đang học (màu xanh dương)
- 📅 Bài học sắp tới (màu xanh lá)
- ✅ Bài tập hoàn thành (màu tím)
- ⭐ Điểm trung bình (màu vàng)

### 4. Quick Actions (4 nút thao tác nhanh)

#### Admin:
- ➕ Tạo lớp học mới
- 👔 Quản lý giáo viên
- 📊 Báo cáo thống kê
- 💰 Quản lý thanh toán

#### Teacher:
- 📖 Tạo bài giảng
- ✍️ Tạo bài tập
- ✅ Duyệt yêu cầu (có badge số lượng)
- 🤖 AI Trợ giảng (Chatbot)

#### Student:
- 🔍 Tìm lớp học
- ✍️ Làm bài tập
- 📅 Lịch học
- 💳 Thanh toán

### 5. Main Content Area

#### Lớp học gần đây (2/3 màn hình):
- Card lớp học với:
  - Tên lớp học
  - Giáo viên
  - Số học sinh
  - Buổi học tiếp theo
  - Trạng thái (active/pending/completed)
  - Progress bar (tiến độ học tập)

#### Hoạt động gần đây (1/3 màn hình):
- Timeline các hoạt động với icon màu sắc:
  - 🔵 Yêu cầu tham gia lớp
  - 🟢 Bài giảng mới
  - 🟣 Nộp bài tập
  - 🟡 Thanh toán

## 🎨 Color Palette

### Primary Colors (Gradient):
- **Amber to Orange**: `from-amber-400 to-orange-500`
- Dùng cho logo, progress bar, accent

### Stat Card Colors:
- **Blue**: `from-blue-400 to-blue-600` - Lớp học
- **Green**: `from-green-400 to-green-600` - Học sinh
- **Purple**: `from-purple-400 to-purple-600` - Bài tập/Quiz
- **Yellow**: `from-yellow-400 to-orange-500` - Doanh thu/Điểm
- **Orange**: `from-orange-400 to-orange-600` - Cảnh báo

### Background:
- **Main**: `bg-gradient-to-br from-gray-50 to-gray-100`
- **Card**: `bg-white` với `shadow-sm border border-gray-200`

## 🔄 Thay đổi vai trò để test

Trong file `page.tsx`, dòng 32, thay đổi giá trị `role`:

```typescript
const [currentUser] = useState<MockUser>({
  id: 1,
  fullName: 'Nguyễn Văn A',
  email: 'admin@bee.edu.vn',
  role: 'admin', // Thay bằng 'teacher' hoặc 'student'
  avatar: undefined
});
```

## 🚀 Các tính năng đã implement

✅ Responsive design (mobile, tablet, desktop)
✅ Hover effects và transitions
✅ Badge cho notifications
✅ Progress bar cho tiến độ học tập
✅ Status tags với màu sắc
✅ Timeline hoạt động
✅ Gradient icons
✅ Mock data đầy đủ

## 📝 TODO - Tích hợp API

Khi backend sẵn sàng, cần tích hợp:

1. **Authentication**:
   ```typescript
   const { user } = useAuth(); // Lấy từ Redux store
   ```

2. **Fetch Stats**:
   ```typescript
   useEffect(() => {
     const fetchStats = async () => {
       const data = await apiGetDashboardStats();
       setStats(data);
     };
     fetchStats();
   }, []);
   ```

3. **Fetch Classrooms**:
   ```typescript
   const { data: classrooms } = useQuery('classrooms', fetchClassrooms);
   ```

4. **Real-time Activities**:
   ```typescript
   // Socket.IO hoặc polling
   socket.on('new_activity', (activity) => {
     setActivities(prev => [activity, ...prev]);
   });
   ```

## 🎯 Hướng dẫn phát triển tiếp

### Thêm trang chi tiết:
- `/dashboard/classrooms` - Danh sách lớp học
- `/dashboard/classrooms/[id]` - Chi tiết lớp học
- `/dashboard/students` - Quản lý học sinh (Teacher)
- `/dashboard/exercises` - Bài tập
- `/dashboard/payments` - Thanh toán
- `/dashboard/reports` - Báo cáo

### Components tái sử dụng:
- `<StatCard />` - Thẻ thống kê
- `<QuickActionCard />` - Nút thao tác nhanh
- `<ClassroomCard />` - Card lớp học
- `<ActivityCard />` - Card hoạt động

## 🎨 Design Principles

1. **Consistency**: Màu sắc và spacing đồng nhất
2. **Hierarchy**: Thông tin quan trọng nổi bật
3. **Feedback**: Hover, active states rõ ràng
4. **Accessibility**: Contrast tốt, text dễ đọc
5. **Performance**: Tối ưu rendering

## 📱 Responsive Breakpoints

- Mobile: `< 768px` - Single column
- Tablet: `768px - 1024px` - 2 columns
- Desktop: `> 1024px` - 3-4 columns

---

**Note**: Dashboard này chỉ là UI mockup. Tất cả dữ liệu đều là mock data cứng trong code. Cần tích hợp API từ backend để hiển thị dữ liệu thực.
