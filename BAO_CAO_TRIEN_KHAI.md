# 3.2 Triển khai hệ thống Backend

## 3.2.5 Authentication & Authorization

### JWT Authentication
Sử dụng JWT Bearer token với cấu hình:
- **Secret Key**: 256-bit symmetric key
- **Expiry**: 120 phút (có thể cấu hình)
- **Claims**: UserId, Email, RoleId, RoleName

```csharp
// Program.cs - JWT Configuration
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey))
        };
    });
```

### Permission-based Authorization
Custom middleware kiểm tra quyền chi tiết:
```csharp
[RequirePermission("ManageQuizzes")]
public async Task<IActionResult> CreateQuiz([FromBody] CreateQuizDto dto)
{
    // User phải có permission "ManageQuizzes"
}
```

**Permission Modules:**
- User Management (ManageUsers, ViewUsers)
- Classroom Management (ManageClassrooms, ViewClassrooms)
- Quiz Management (ManageQuizzes, ViewQuizzes)
- Statistics (ViewAdminStatistics, ViewTutorStatistics)

## 3.2.6 Object Storage với MinIO

MinIO được sử dụng làm S3-compatible storage cho media files:

**Cấu hình:**
```json
{
  "S3Storage": {
    "ServiceUrl": "http://minio:9000",      // Internal Docker network
    "PublicUrl": "http://localhost:8080/storage",  // Public access via Nginx
    "AccessKey": "minioadmin",
    "SecretKey": "minioadmin123",
    "DefaultBucket": "tutor-center",
    "Region": "us-east-1"
  }
}
```

**Upload flow:**
1. Client gửi file lên `/api/Media/upload`
2. Backend validate và upload lên MinIO
3. Lưu metadata vào bảng `Media`
4. Trả về MediaId và public URL

**Public URL generation:**
```csharp
public string GetFileUrl(string path, string? bucket = null)
{
    bucket ??= _settings.DefaultBucket;
    var baseUrl = string.IsNullOrEmpty(_settings.PublicUrl) 
        ? _settings.ServiceUrl 
        : _settings.PublicUrl;
    
    return $"{baseUrl}/{bucket}/{path}";
}
// Output: http://localhost:8080/storage/tutor-center/uploads/user.jpg
```

## 3.2.7 API Endpoints

### Authentication Endpoints
```
POST   /api/Auth/login              - Đăng nhập
POST   /api/Auth/register           - Đăng ký
POST   /api/Auth/forgot-password    - Quên mật khẩu
POST   /api/Auth/reset-password     - Đặt lại mật khẩu
POST   /api/Auth/refresh-token      - Làm mới token
```

### User Management Endpoints
```
GET    /api/User                    - Danh sách người dùng (phân trang)
POST   /api/User/tutors             - Tạo tài khoản gia sư
PUT    /api/User/{id}/status        - Thay đổi trạng thái
```

### Classroom Endpoints
```
GET    /api/Classroom               - Danh sách lớp học
GET    /api/Classroom/{id}          - Chi tiết lớp học
POST   /api/Classroom               - Tạo lớp học mới
PUT    /api/Classroom/{id}          - Cập nhật lớp học
DELETE /api/Classroom/{id}          - Xóa lớp học
PUT    /api/Classroom/{id}/archive-status - Toggle archive
```

### Quiz Management Endpoints
```
GET    /api/Quiz                    - Danh sách quiz
GET    /api/Quiz/{id}/detail        - Chi tiết quiz với câu hỏi
POST   /api/Quiz                    - Tạo quiz mới
PUT    /api/Quiz/{id}               - Cập nhật quiz
DELETE /api/Quiz/{id}               - Xóa quiz

POST   /api/Question                - Tạo câu hỏi
POST   /api/Question/{id}/media     - Attach media vào câu hỏi
DELETE /api/Question/{id}/media/{mediaId} - Detach media

POST   /api/Option                  - Tạo đáp án
POST   /api/Option/{id}/media       - Attach media vào đáp án
```

### Statistics Endpoints
```
GET    /api/admin/statistics/overview          - Tổng quan hệ thống
GET    /api/admin/statistics/top-tutors        - Top gia sư
GET    /api/admin/statistics/growth-time-series - Biểu đồ tăng trưởng
GET    /api/admin/statistics/revenue-time-series - Biểu đồ doanh thu

GET    /api/tutor/statistics/overview          - Tổng quan gia sư
GET    /api/tutor/statistics/classrooms        - Thống kê lớp học
GET    /api/tutor/statistics/revenue-time-series - Doanh thu theo thời gian
```

### Media Management Endpoints
```
POST   /api/Media/upload            - Upload file
GET    /api/Media/{id}              - Lấy thông tin media
DELETE /api/Media/{id}              - Xóa media
```

## 3.2.8 Docker Deployment

### Multi-stage Dockerfile
```dockerfile
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "TutorCenterBackend.Presentation/TutorCenterBackend.Presentation.csproj"
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y curl
COPY --from=build /app/publish .
EXPOSE 5000
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1
ENTRYPOINT ["dotnet", "TutorCenterBackend.Presentation.dll"]
```

### Docker Compose Configuration
```yaml
backend:
  build:
    context: ./TutorCenterBackend
    dockerfile: Dockerfile
  container_name: tutor_backend
  environment:
    - ASPNETCORE_ENVIRONMENT=Production
    - ASPNETCORE_URLS=http://+:5000
    - ConnectionStrings__DefaultConnection=Server=sqlserver,1433;...
    - S3Storage__ServiceUrl=http://minio:9000
    - S3Storage__PublicUrl=http://localhost:8080/storage
    - Jwt__Key=${JWT_SECRET_KEY}
  depends_on:
    sqlserver:
      condition: service_healthy
    minio:
      condition: service_healthy
  networks:
    - tutor_network
  restart: unless-stopped
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
    interval: 10s
    timeout: 3s
    retries: 3
```

## 3.2.9 CORS Configuration

Để hỗ trợ cả development và production:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                  "http://localhost:5173",   // Vite dev server
                  "http://localhost:8080",   // Nginx (production)
                  "http://localhost:3000"    // Alternative dev port
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

app.UseCors("AllowFrontend");
```

## 3.2.10 Error Handling & Logging

### Global Exception Handler
```csharp
public class GlobalExceptionHandler
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            await HandleValidationException(context, ex);
        }
        catch (UnauthorizedAccessException ex)
        {
            await HandleUnauthorizedException(context, ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            await HandleGenericException(context, ex);
        }
    }
}
```

### Health Check Endpoint
```csharp
app.MapGet("/health", () => Results.Ok(new 
{ 
    status = "healthy", 
    timestamp = DateTime.UtcNow 
})).AllowAnonymous();
```

## 3.2.11 Performance Optimization

### Database Optimization
- **Eager Loading**: Sử dụng `.Include()` để giảm N+1 queries
- **Indexing**: Tạo index cho các column thường query
- **Pagination**: Tất cả list endpoints đều có phân trang

```csharp
public async Task<PagedResult<ClassroomResponseDto>> GetClassroomsAsync(
    ClassroomFilterDto filter)
{
    var query = _context.Classrooms
        .Include(c => c.Creator)
        .Include(c => c.Subject)
        .AsQueryable();
    
    // Apply filters
    if (!string.IsNullOrEmpty(filter.SearchTerm))
        query = query.Where(c => c.Title.Contains(filter.SearchTerm));
    
    // Pagination
    var total = await query.CountAsync();
    var items = await query
        .Skip((filter.PageNumber - 1) * filter.PageSize)
        .Take(filter.PageSize)
        .ToListAsync();
    
    return new PagedResult<ClassroomResponseDto>
    {
        Items = _mapper.Map<List<ClassroomResponseDto>>(items),
        TotalCount = total,
        PageNumber = filter.PageNumber,
        PageSize = filter.PageSize
    };
}
```

### Caching Strategy
- Memory cache cho permissions (giảm database hits)
- Cache timeout: 5 phút

```csharp
public async Task<bool> HasPermissionAsync(int userId, string permissionName)
{
    var cacheKey = $"user_{userId}_permissions";
    
    if (!_cache.TryGetValue(cacheKey, out List<string> permissions))
    {
        permissions = await _permissionRepository
            .GetUserPermissionsAsync(userId);
        
        _cache.Set(cacheKey, permissions, TimeSpan.FromMinutes(5));
    }
    
    return permissions.Contains(permissionName);
}
```

## 3.2.12 Security Measures

### Input Validation
Sử dụng FluentValidation cho tất cả input:
```csharp
public class CreateQuizDtoValidator : AbstractValidator<CreateQuizDto>
{
    public CreateQuizDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Tiêu đề không được để trống")
            .MaximumLength(200).WithMessage("Tiêu đề không quá 200 ký tự");
        
        RuleFor(x => x.TimeLimit)
            .GreaterThan(0).WithMessage("Thời gian phải lớn hơn 0");
    }
}
```

### SQL Injection Prevention
Entity Framework Core tự động parameterize queries:
```csharp
var users = await _context.Users
    .Where(u => u.Email == email) // Parameterized automatically
    .ToListAsync();
```

### XSS Prevention
API trả về JSON, frontend responsibility để sanitize HTML.

### Password Security
- Hash với BCrypt
- Salt tự động
- Min length: 8 characters

```csharp
public string HashPassword(string password)
{
    return BCrypt.Net.BCrypt.HashPassword(password);
}

public bool VerifyPassword(string password, string hash)
{
    return BCrypt.Net.BCrypt.Verify(password, hash);
}
```

## 3.2.13 Testing & Monitoring

### Health Checks
```bash
# Backend health
curl http://localhost:8080/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2026-01-07T06:00:00Z"
}
```

### Logging
Sử dụng ILogger<T> với structured logging:
```csharp
_logger.LogInformation(
    "User {UserId} created classroom {ClassroomId}",
    userId, classroomId);

_logger.LogWarning(
    "Unauthorized access attempt to {Path} by user {UserId}",
    path, userId);
```

### Container Monitoring
```bash
# Check container status
docker compose ps

# View logs
docker compose logs -f backend

# Check resource usage
docker stats tutor_backend
```

---

# 3.3 Triển khai hệ thống Web Admin

## 3.3.1 Tổng quan hệ thống Web Admin

Hệ thống Web Admin được xây dựng với **React 19.2.0** và **Vite** làm build tool, cung cấp giao diện quản trị toàn diện cho administrator và tutor. Ứng dụng được thiết kế theo mô hình **Single Page Application (SPA)** với routing client-side, đảm bảo trải nghiệm người dùng mượt mà.

### Đặc điểm chính:
- ✅ **Responsive Design**: Tương thích mọi thiết bị
- ✅ **Real-time Updates**: Cập nhật dữ liệu tức thời
- ✅ **Role-based UI**: Hiển thị theo vai trò người dùng
- ✅ **Rich Data Visualization**: Biểu đồ và thống kê trực quan
- ✅ **File Management**: Upload/preview ảnh, PDF, video

## 3.3.2 Công nghệ Frontend

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| React | 19.2.0 | UI Framework |
| Vite | 6.2.0 | Build tool & dev server |
| Redux Toolkit | 2.5.0 | State management |
| React Router | 7.1.3 | Client-side routing |
| Axios | 1.7.9 | HTTP client |
| Recharts | 2.14.1 | Data visualization |
| TailwindCSS | 3.4.17 | Utility-first CSS |
| React Markdown | 9.0.1 | Markdown rendering |
| React PDF | 10.0.0 | PDF preview |

## 3.3.3 Cấu trúc thư mục

```
web_app/
├── public/                         # Static assets
├── src/
│   ├── app/                        # Main app component
│   ├── assets/                     # Images, icons
│   ├── components/                 # Reusable components
│   │   ├── common/                 # Button, Input, Modal
│   │   ├── layout/                 # Header, Sidebar, Footer
│   │   ├── quiz/                   # Quiz-specific components
│   │   └── charts/                 # Chart components
│   ├── core/
│   │   └── constants/              # API endpoints, routes
│   ├── hooks/                      # Custom React hooks
│   ├── pages/                      # Page components
│   │   ├── admin/                  # Admin pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Classrooms.jsx
│   │   │   ├── Tutors.jsx
│   │   │   └── Students.jsx
│   │   └── tutor/                  # Tutor pages
│   │       ├── Dashboard.jsx
│   │       ├── Classrooms.jsx
│   │       ├── Quizzes.jsx
│   │       └── QuizDetail.jsx
│   ├── services/                   # API services
│   │   ├── api.js                  # Axios instance
│   │   ├── authApi.js
│   │   ├── classroomApi.js
│   │   ├── quizApi.js
│   │   └── adminStatisticsApi.js
│   ├── store/                      # Redux store
│   │   ├── index.js                # Store configuration
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── classroomSlice.js
│   │       ├── quizSlice.js
│   │       └── adminStatisticsSlice.js
│   ├── types/                      # TypeScript types (if used)
│   └── utils/                      # Helper functions
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 3.3.4 State Management với Redux Toolkit

### Store Configuration
```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import classroomReducer from './slices/classroomSlice';
import quizReducer from './slices/quizSlice';
import adminStatisticsReducer from './slices/adminStatisticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classrooms: classroomReducer,
    quizzes: quizReducer,
    adminStatistics: adminStatisticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
```

### Async Thunks Pattern
```javascript
// store/slices/adminStatisticsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOverviewStatistics } from '../../services/adminStatisticsApi';

export const fetchOverviewStatistics = createAsyncThunk(
  'adminStatistics/fetchOverview',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await getOverviewStatistics(startDate, endDate);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const adminStatisticsSlice = createSlice({
  name: 'adminStatistics',
  initialState: {
    overview: null,
    topTutors: [],
    growthTimeSeries: [],
    revenueTimeSeries: [],
    status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverviewStatistics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOverviewStatistics.fulfilled, (state, action) => {
        state.status = 'success';
        state.overview = action.payload;
      })
      .addCase(fetchOverviewStatistics.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      });
  },
});

export default adminStatisticsSlice.reducer;
```

## 3.3.5 API Integration

### Axios Configuration
```javascript
// services/api.js
import axios from 'axios';
import { API_BASE_URL } from '../core/constants';

const api = axios.create({
  baseURL: API_BASE_URL, // '/api' in production
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Service Example
```javascript
// services/adminStatisticsApi.js
import api from './api';
import { API_ENDPOINTS } from '../core/constants';

export const getOverviewStatistics = (startDate, endDate) => {
  return api.get(API_ENDPOINTS.ADMIN_STATISTICS.GET_OVERVIEW, {
    params: { startDate, endDate },
  });
};

export const getTopTutors = (limit) => {
  return api.get(API_ENDPOINTS.ADMIN_STATISTICS.GET_TOP_TUTORS, {
    params: { limit },
  });
};

export const getGrowthTimeSeries = (startDate, endDate, interval) => {
  return api.get(API_ENDPOINTS.ADMIN_STATISTICS.GET_GROWTH_TIME_SERIES, {
    params: { startDate, endDate, interval },
  });
};
```

## 3.3.6 Admin Dashboard Component

### Overview Statistics Cards
```jsx
// pages/admin/Dashboard.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOverviewStatistics } from '../../store/slices/adminStatisticsSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { overview, status } = useSelector((state) => state.adminStatistics);

  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    dispatch(fetchOverviewStatistics({ startDate, endDate }));
  }, [dispatch]);

  if (status === 'loading') return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng số gia sư"
          value={overview?.totalTutors || 0}
          icon="👨‍🏫"
          color="blue"
        />
        <StatCard
          title="Tổng số học sinh"
          value={overview?.totalStudents || 0}
          icon="👨‍🎓"
          color="green"
        />
        <StatCard
          title="Lớp học"
          value={overview?.totalClassrooms || 0}
          icon="📚"
          color="purple"
        />
        <StatCard
          title="Doanh thu"
          value={formatCurrency(overview?.totalRevenue || 0)}
          icon="💰"
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GrowthChart />
        <RevenueChart />
      </div>

      {/* Top Tutors Table */}
      <TopTutorsTable />
    </div>
  );
};
```

### Data Visualization with Recharts
```jsx
// components/charts/GrowthChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useSelector } from 'react-redux';

const GrowthChart = () => {
  const { growthTimeSeries } = useSelector((state) => state.adminStatistics);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Biểu đồ tăng trưởng</h3>
      <LineChart width={500} height={300} data={growthTimeSeries}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="newTutors" 
          stroke="#3B82F6" 
          name="Gia sư mới"
        />
        <Line 
          type="monotone" 
          dataKey="newStudents" 
          stroke="#10B981" 
          name="Học sinh mới"
        />
        <Line 
          type="monotone" 
          dataKey="newClassrooms" 
          stroke="#8B5CF6" 
          name="Lớp học mới"
        />
      </LineChart>
    </div>
  );
};
```

## 3.3.7 Quiz Management System

### Quiz List Page
```jsx
// pages/tutor/Quizzes.jsx
const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    classroomId: null,
    pageNumber: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchQuizzes();
  }, [filters]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await getQuizzes(filters);
      setQuizzes(response.data.items);
    } catch (error) {
      toast.error('Không thể tải danh sách quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Quiz</h1>
        <button 
          onClick={() => navigate('/tutor/quizzes/create')}
          className="btn btn-primary"
        >
          + Tạo Quiz Mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm quiz..."
          value={filters.searchTerm}
          onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
          className="input"
        />
      </div>

      {/* Quiz Table */}
      <QuizTable quizzes={quizzes} loading={loading} />
    </div>
  );
};
```

### Quiz Detail with Questions
```jsx
// pages/tutor/QuizDetail.jsx
const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchQuizDetail();
  }, [id]);

  const fetchQuizDetail = async () => {
    const response = await getQuizDetail(id);
    setQuiz(response.data.quiz);
    setSections(response.data.sections);
  };

  return (
    <div className="p-6">
      {/* Quiz Header */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h1 className="text-3xl font-bold mb-2">{quiz?.title}</h1>
        <div className="flex gap-4 text-gray-600">
          <span>⏱ {quiz?.timeLimit} phút</span>
          <span>📊 {quiz?.totalPoints} điểm</span>
          <span>🔢 {quiz?.totalQuestions} câu hỏi</span>
        </div>
      </div>

      {/* Sections & Questions */}
      {sections.map((section) => (
        <QuizSection 
          key={section.sectionId} 
          section={section}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
        />
      ))}

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <button onClick={handleAddQuestion} className="btn btn-primary">
          + Thêm câu hỏi
        </button>
        <button onClick={handleAddSection} className="btn btn-secondary">
          + Thêm section
        </button>
      </div>
    </div>
  );
};
```

### Question Editor with Media Upload
```jsx
// components/quiz/EditQuestionPanel.jsx
const EditQuestionPanel = ({ question, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    text: question?.text || '',
    points: question?.points || 1,
    type: question?.type || 0,
  });
  const [mediaList, setMediaList] = useState([]);

  const handleMediaUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await uploadMedia(formData);
      const mediaId = response.data.mediaId;
      
      // Attach to question
      await attachQuestionMedia(question.questionId, mediaId);
      
      // Reload media list
      fetchQuestionMedias();
      toast.success('Upload thành công');
    } catch (error) {
      toast.error('Upload thất bại');
    }
  };

  const handleRemoveMedia = async (mediaId) => {
    try {
      await detachQuestionMedia(question.questionId, mediaId);
      fetchQuestionMedias();
      toast.success('Đã xóa media');
    } catch (error) {
      toast.error('Không thể xóa media');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Chỉnh sửa câu hỏi</h3>
      
      {/* Question Text */}
      <textarea
        value={formData.text}
        onChange={(e) => setFormData({...formData, text: e.target.value})}
        className="textarea mb-4"
        rows={4}
        placeholder="Nhập nội dung câu hỏi..."
      />

      {/* Media Upload */}
      <MediaUpload 
        onUpload={handleMediaUpload}
        maxSize={10 * 1024 * 1024} // 10MB
        accept="image/*,application/pdf"
      />

      {/* Media List */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {mediaList.map((media) => (
          <div key={media.mediaId} className="relative group">
            <img 
              src={media.mediaUrl} 
              alt="Question media"
              className="w-full h-32 object-cover rounded"
            />
            <button
              onClick={() => handleRemoveMedia(media.mediaId)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <button onClick={onCancel} className="btn btn-secondary">
          Hủy
        </button>
        <button onClick={handleSave} className="btn btn-primary">
          Lưu
        </button>
      </div>
    </div>
  );
};
```

## 3.3.8 Routing & Navigation

### Route Configuration
```jsx
// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="Admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="classrooms" element={<AdminClassrooms />} />
          <Route path="tutors" element={<AdminTutors />} />
          <Route path="students" element={<AdminStudents />} />
        </Route>

        {/* Tutor Routes */}
        <Route path="/tutor" element={
          <ProtectedRoute requiredRole="Tutor">
            <TutorLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<TutorDashboard />} />
          <Route path="classrooms" element={<TutorClassrooms />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="quizzes/:id" element={<QuizDetail />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Protected Route Component
```jsx
// components/ProtectedRoute.jsx
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('accessToken');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.roleName !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

## 3.3.9 Docker Deployment Frontend

### Multi-stage Dockerfile
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist .
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx SPA Configuration
```nginx
# nginx-spa.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # SPA routing - always return index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

### Environment Variables
```bash
# .env
VITE_API_BASE_URL=/api  # Relative path qua nginx trong Docker
```

## 3.3.10 Performance Optimization

### Code Splitting
```jsx
// Lazy loading components
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const TutorQuizzes = lazy(() => import('./pages/tutor/Quizzes'));

<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>
```

### Memoization
```jsx
// Memoize expensive computations
const expensiveData = useMemo(() => {
  return processLargeDataset(rawData);
}, [rawData]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### Image Optimization
```jsx
// Lazy load images
<img 
  src={thumbnail} 
  loading="lazy"
  alt="Preview"
/>

// Use WebP format with fallback
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Fallback" />
</picture>
```

## 3.3.11 User Experience Features

### Toast Notifications
```jsx
import { toast } from 'react-toastify';

toast.success('✓ Lưu thành công!');
toast.error('✗ Có lỗi xảy ra');
toast.warning('⚠ Cảnh báo');
toast.info('ℹ Thông tin');
```

### Loading States
```jsx
{loading ? (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
  </div>
) : (
  <DataTable data={data} />
)}
```

### Confirmation Dialogs
```jsx
const handleDelete = async (id) => {
  if (window.confirm('Bạn có chắc muốn xóa?')) {
    try {
      await deleteQuiz(id);
      toast.success('Đã xóa');
      fetchQuizzes();
    } catch (error) {
      toast.error('Không thể xóa');
    }
  }
};
```

## 3.3.12 Testing Strategy

### Manual Testing Checklist
- ✅ Login/Logout flow
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Form validation
- ✅ File upload/download
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Browser compatibility (Chrome, Firefox, Safari, Edge)
- ✅ Error handling & edge cases

### Browser DevTools
```javascript
// Performance profiling
console.time('fetchData');
await fetchData();
console.timeEnd('fetchData');

// Network inspection
// Check API calls in Network tab

// React DevTools
// Inspect component tree and props
```

## 3.3.13 Deployment Summary

### Build Process
```bash
# Install dependencies
npm ci

# Set environment variable
export VITE_API_BASE_URL=/api

# Build for production
npm run build

# Output: dist/ directory with optimized files
```

### Docker Compose Integration
```yaml
frontend:
  build:
    context: ./web_app
    dockerfile: Dockerfile
    args:
      - VITE_API_BASE_URL=/api
  container_name: tutor_frontend
  networks:
    - tutor_network
  restart: unless-stopped
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://127.0.0.1:80"]
    interval: 10s
    timeout: 3s
    retries: 3
```

### Production Access
- **Local**: http://localhost:8080
- **Ngrok**: https://your-subdomain.ngrok-free.dev
- **Custom Domain**: Configure DNS and SSL certificate

---

## Kết luận

Hệ thống đã được triển khai thành công với:

**Backend:**
- ✅ Clean Architecture với 4 layers
- ✅ RESTful API với 50+ endpoints
- ✅ JWT Authentication & Permission-based Authorization
- ✅ MinIO Object Storage với public URL routing
- ✅ Docker containerization với health checks
- ✅ Comprehensive error handling và logging

**Frontend:**
- ✅ React SPA với Redux state management
- ✅ Admin Dashboard với charts và statistics
- ✅ Quiz Management với media upload
- ✅ Responsive UI với TailwindCSS
- ✅ Docker Nginx serving với SPA routing
- ✅ Environment-based configuration

**Infrastructure:**
- ✅ Docker Compose orchestration
- ✅ Nginx reverse proxy
- ✅ SQL Server persistent storage
- ✅ MinIO S3-compatible storage
- ✅ Ngrok public tunneling
- ✅ Health monitoring và logging

Hệ thống sẵn sàng cho việc development, testing và deployment production.
