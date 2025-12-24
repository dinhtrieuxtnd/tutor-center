# React Vite Tutor Center

Dự án React + Vite với cấu trúc code sạch, dễ bảo trì và mở rộng.

## 🏗️ Cấu trúc dự án

```
src/
├── core/              # Core modules (API, Store, Utils, Constants)
│   ├── api/          # Axios client & API endpoints
│   ├── store/        # Redux store configuration
│   ├── constants/    # App constants
│   └── utils/        # Utility functions
├── features/         # Feature modules
│   └── users/        # User feature
│       ├── UserCard.jsx
│       ├── UserList.jsx
│       ├── useUsers.js
│       ├── userSlice.js
│       └── index.js
├── routes/           # Page routes
│   ├── HomePage.jsx
│   └── index.js
└── shared/           # Shared components
    └── components/
        ├── Layout.jsx
        ├── Button.jsx
        ├── Loading.jsx
        └── index.js
```

## 🎯 Nguyên tắc tổ chức code

### 1. **Core** - Các module cốt lõi
- `api/`: Cấu hình Axios và các API endpoints
- `store/`: Redux store, hooks
- `constants/`: Các hằng số dùng chung
- `utils/`: Các hàm tiện ích tái sử dụng

### 2. **Features** - Tính năng theo module
Mỗi feature là một module độc lập, bao gồm:
- Components (UI)
- Hooks (Logic)
- Slice (State management)
- API calls (nếu cần)

### 3. **Routes** - Các trang
Chứa các page components chính của ứng dụng

### 4. **Shared** - Các thành phần dùng chung
Components có thể tái sử dụng ở nhiều nơi

## 🚀 Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool & dev server nhanh
- **Axios** - HTTP client
- **Redux Toolkit** - State management đơn giản
- **Tailwind CSS v3** - Utility-first CSS framework

## 📦 Cài đặt

```bash
npm install
```

## 🔧 Chạy dự án

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview build
```bash
npm run preview
```

## 📝 Hướng dẫn thêm feature mới

### Bước 1: Tạo folder feature mới
```
src/features/posts/
├── PostCard.jsx       # UI component
├── PostList.jsx       # UI component
├── usePosts.js        # Custom hook
├── postSlice.js       # Redux slice
└── index.js           # Export tất cả
```

### Bước 2: Tạo API endpoint
```javascript
// src/core/api/postApi.js
export const postApi = {
  getAll: () => axiosClient.get('/posts'),
  getById: (id) => axiosClient.get(`/posts/${id}`),
};
```

### Bước 3: Tạo Redux slice
```javascript
// src/features/posts/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPosts = createAsyncThunk('post/fetchPosts', ...);

const postSlice = createSlice({
  name: 'post',
  initialState: { posts: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => { ... }
});
```

### Bước 4: Thêm reducer vào store
```javascript
// src/core/store/index.js
import postReducer from '../../features/posts/postSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer, // Thêm reducer mới
  },
});
```

### Bước 5: Tạo custom hook
```javascript
// src/features/posts/usePosts.js
export const usePosts = () => {
  const dispatch = useAppDispatch();
  const { posts, loading, error } = useAppSelector(state => state.post);
  
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);
  
  return { posts, loading, error };
};
```

### Bước 6: Sử dụng trong component
```javascript
import { usePosts } from '../features/posts';

const PostsPage = () => {
  const { posts, loading, error } = usePosts();
  // Render UI
};
```

## 🔐 Environment Variables

Tạo file `.env`:

```env
VITE_API_BASE_URL=https://your-api-url.com
```

## 💡 Best Practices

1. **Tổ chức theo feature**: Mỗi feature là một module độc lập
2. **Component nhỏ, tập trung**: Một component chỉ làm một việc
3. **Custom hooks**: Tách logic ra khỏi component
4. **Redux Toolkit**: Sử dụng createAsyncThunk cho async logic
5. **Tailwind CSS**: Sử dụng utility classes, tránh custom CSS
6. **Export centralized**: Mỗi folder có file index.js để export

## 📚 Tài nguyên

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)

## 📄 License

MIT
