# 🔧 Cấu Hình API & CORS - Docker Deployment

## 📋 Tổng Quan

Sau khi deploy với Docker, frontend và backend đều chạy qua Nginx reverse proxy trên cùng domain `localhost:8080`, nên:
- ✅ **Không cần CORS** cho production deployment (cùng origin)
- ✅ **API URL dùng relative path** `/api` thay vì absolute URL
- ✅ **CORS vẫn được config** để hỗ trợ development mode

---

## 🌐 Cấu Hình Frontend

### API Base URL

**File:** `web_app/src/core/constants/index.js`

```javascript
// Sử dụng environment variable từ Docker build args hoặc .env
// Trong production (Docker): VITE_API_BASE_URL='/api' (relative path qua nginx)
// Trong development: VITE_API_BASE_URL='http://localhost:5038/api'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5038/api';
```

### Environment Variables

**File:** `.env`

```bash
# Production (Docker) - Relative path qua nginx
VITE_API_BASE_URL=/api

# Development (Local) - Uncomment và sử dụng:
# VITE_API_BASE_URL=http://localhost:5038/api
```

### Build Time Configuration

Frontend Docker build nhận `VITE_API_BASE_URL` từ `.env`:

```dockerfile
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build
```

---

## 🔐 Cấu Hình Backend CORS

**File:** `TutorCenterBackend/TutorCenterBackend.Presentation/Program.cs`

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                  "http://localhost:5173",   // Vite dev server
                  "http://localhost:5174",   // Vite dev server alt port
                  "http://localhost:5175",   // Vite dev server alt port
                  "http://localhost:8080",   // Nginx reverse proxy (production)
                  "http://localhost:3000"    // Common dev port
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ...

app.UseCors("AllowFrontend");
```

### CORS Policy Details

- **Allowed Origins:**
  - Development: `localhost:5173-5175` (Vite dev server)
  - Production: `localhost:8080` (Nginx)
- **Headers:** All (`AllowAnyHeader`)
- **Methods:** All (`AllowAnyMethod`)
- **Credentials:** Enabled (`AllowCredentials`)

---

## 🔀 Nginx Routing

**File:** `nginx/nginx.conf`

```nginx
# Backend API
location /api {
    proxy_pass http://backend:5000;
    # ... proxy headers
}

# Frontend SPA
location / {
    proxy_pass http://frontend:80;
    # ... proxy headers
}
```

### Request Flow

```
Browser → http://localhost:8080/api/tutors
         ↓
    Nginx (port 8080)
         ↓
    Backend Container (port 5000)
         ↓
    Response
```

**Key Point:** Frontend và backend đều qua Nginx trên cùng origin `localhost:8080`, nên **không có CORS issues** trong production!

---

## ✅ Testing

### 1. Verify API URL Configuration

Open browser DevTools:
```javascript
// In console
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
```

Expected: `/api`

### 2. Test API Calls

```javascript
// Test fetch
fetch('/api/tutors')
  .then(res => console.log('Status:', res.status))
  .catch(err => console.error('Error:', err));
```

Expected: `Status: 401` (Unauthorized - authentication working)

### 3. Use Test HTML Page

Open `test-api-integration.html` in browser:
- Click "Run All Tests"
- Check all tests pass
- Verify no CORS errors in console

### 4. Network Tab Inspection

1. Open DevTools → Network tab
2. Trigger API call in app
3. Check request URL: `http://localhost:8080/api/...`
4. Check response headers: Should include CORS headers

---

## 🐛 Troubleshooting

### Issue: CORS Error in Production

**Symptom:**
```
Access to fetch at 'http://localhost:5000/api/tutors' from origin 'http://localhost:8080' 
has been blocked by CORS policy
```

**Solution:**
- Ensure backend is accessed via Nginx (`/api` path)
- Check `.env` has `VITE_API_BASE_URL=/api`
- Rebuild frontend: `docker compose up -d --build frontend`

### Issue: API 404 Not Found

**Symptom:**
```
GET http://localhost:8080/api/tutors → 404
```

**Solution:**
- Check nginx routing configuration
- Restart nginx: `docker compose restart nginx`
- Verify backend is running: `docker compose logs backend`

### Issue: Wrong API URL in Frontend

**Symptom:**
Frontend calls `http://localhost:5038/api` instead of `/api`

**Solution:**
```bash
# Update .env
echo "VITE_API_BASE_URL=/api" >> .env

# Rebuild frontend
docker compose up -d --build frontend
```

---

## 📊 Configuration Summary

| Environment | Frontend URL | API Base URL | CORS Required |
|-------------|--------------|--------------|---------------|
| **Production (Docker)** | `http://localhost:8080` | `/api` | ❌ No (same origin) |
| **Development (Local)** | `http://localhost:5173` | `http://localhost:5038/api` | ✅ Yes (different origins) |

---

## 🔄 Switching Between Environments

### Development → Production

```bash
# Update .env
VITE_API_BASE_URL=/api

# Rebuild
docker compose up -d --build frontend
```

### Production → Development

```bash
# Update .env
VITE_API_BASE_URL=http://localhost:5038/api

# Run locally
cd web_app
npm run dev
```

---

## 📝 Notes

1. **Same Origin Policy**: Khi frontend và backend cùng origin (`localhost:8080`), browser không apply CORS restrictions
2. **Relative Paths**: `/api` tự động resolve thành `http://localhost:8080/api`
3. **Build Time Config**: `VITE_API_BASE_URL` được embed vào build artifacts, không thể thay đổi runtime
4. **CORS Headers**: Vẫn được backend trả về, nhưng browser không check khi same origin

---

## 🎯 Best Practices

1. ✅ **Use environment variables** cho API URLs
2. ✅ **Use relative paths** trong production
3. ✅ **Configure CORS** cho development
4. ✅ **Test thoroughly** sau khi build
5. ✅ **Check Network tab** để verify requests
6. ✅ **Document configuration** trong README

---

## 🚀 Quick Commands

```bash
# Check current API URL in frontend build
docker compose exec frontend grep -r "API_BASE_URL" /usr/share/nginx/html/assets/

# Test API endpoint
curl -i http://localhost:8080/api/tutors

# Check CORS headers
curl -i -X OPTIONS http://localhost:8080/api/tutors \
  -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: GET"

# Rebuild with new config
docker compose up -d --build frontend backend

# View logs
docker compose logs -f frontend backend nginx
```
