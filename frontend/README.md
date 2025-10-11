# Next.js + Redux + Axios Project

Dự án Next.js được setup với Tailwind CSS, Redux Toolkit và Axios.

## 🚀 Tính năng

- ⚡ Next.js 15 với App Router
- 🎨 Tailwind CSS cho styling
- 🔄 Redux Toolkit cho state management
- 📡 Axios cho HTTP requests
- 📝 TypeScript cho type safety
- 🎯 ESLint cho code quality

## 📦 Cài đặt

```bash
# Clone project (nếu cần)
git clone <repository-url>
cd frontend

# Cài đặt dependencies
npm install
```

## 🛠️ Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout với Redux Provider
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── DemoComponent.tsx  # Component demo Redux + Axios
├── store/                 # Redux store configuration
│   ├── store.ts          # Store setup và typed hooks
│   ├── Provider.tsx      # Redux Provider component
│   └── features/         # Redux slices
│       ├── counter/      # Counter slice (demo)
│       └── user/         # User slice với async thunks
├── services/             # API services
│   └── api.ts           # API functions sử dụng Axios
└── lib/                 # Utilities
    └── axios.ts         # Axios configuration
```

## 🔧 Cấu hình

### Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

### Redux Store

Store đã được cấu hình với:
- Counter slice (demo cơ bản)
- User slice (với async thunks cho API calls)
- TypeScript types cho type safety

### Axios Configuration

- Base URL từ environment variable
- Request/Response interceptors
- Authentication token handling
- Error handling

## 🚀 Chạy dự án

### Development mode
```bash
npm run dev
```
Server sẽ chạy tại: http://localhost:3000

### Build production
```bash
npm run build
```

### Start production server
```bash
npm start
```

## 💡 Cách sử dụng

### Redux Hooks

```typescript
import { useAppDispatch, useAppSelector } from '@/store/store';

// Trong component
const dispatch = useAppDispatch();
const counter = useAppSelector((state) => state.counter);
```

### API Calls với Axios

```typescript
import { userApi } from '@/services/api';

// Gọi API trực tiếp
const users = await userApi.getUsers();

// Hoặc sử dụng Redux async thunks
dispatch(fetchUsers());
```

### Tạo Redux Slice mới

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MyState {
  value: string;
}

const initialState: MyState = {
  value: '',
};

export const mySlice = createSlice({
  name: 'myFeature',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setValue } = mySlice.actions;
export default mySlice.reducer;
```

Sau đó thêm vào store:
```typescript
// src/store/store.ts
import myReducer from './features/my/mySlice';

export const store = configureStore({
  reducer: {
    // ... other reducers
    myFeature: myReducer,
  },
});
```

## 📚 Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

This project is licensed under the MIT License.
