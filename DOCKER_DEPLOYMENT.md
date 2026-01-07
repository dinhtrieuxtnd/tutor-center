# 🚀 TUTOR CENTER - Docker Deployment Guide

## 📋 Tổng quan hệ thống

Hệ thống fullstack hoàn chỉnh chạy trên Docker Compose bao gồm:
- **Frontend**: React/Vite (SPA)
- **Backend**: .NET 8 API
- **Database**: SQL Server 2022
- **Storage**: MinIO (S3-compatible)
- **Proxy**: Nginx
- **Tunnel**: Ngrok (dev only)

## 🏗️ Kiến trúc hệ thống

```
Internet (Client)
       ↓
   [Ngrok Tunnel] (dev only)
       ↓
    [Nginx :80]
       ├── /              → Frontend (Static)
       ├── /api           → Backend API (:5000)
       ├── /storage       → MinIO (:9000)
       └── /minio-console → MinIO Console (:9001)
       
Internal Docker Network:
- backend ←→ sqlserver (:1433)
- backend ←→ minio (:9000)
```

## ⚙️ Cấu hình ban đầu

### 1. Clone repository và setup
```bash
cd tutor-center
```

### 2. Tạo file .env từ template
```bash
cp .env.example .env
```

### 3. Chỉnh sửa .env (QUAN TRỌNG)
```bash
# Mở file .env và cập nhật:
# - SQL_SA_PASSWORD: Mật khẩu SQL Server
# - MINIO_ROOT_PASSWORD: Mật khẩu MinIO
# - JWT_SECRET_KEY: Secret key cho JWT
# - NGROK_AUTHTOKEN: Token từ https://dashboard.ngrok.com
# - Các API keys khác (Resend, Gemini, VNPay...)
```

### 4. Cài đặt Ngrok token (nếu dùng dev mode)
Lấy token tại: https://dashboard.ngrok.com/get-started/your-authtoken

## 🚀 Chạy hệ thống

### Production Mode (không có Ngrok)
```bash
# Build và chạy tất cả services
docker compose up --build

# Hoặc chạy background
docker compose up -d --build
```

### Development Mode (có Ngrok tunnel)
```bash
# Build và chạy với Ngrok
docker compose --profile dev up --build

# Xem Ngrok public URL
docker compose logs ngrok | grep url
```

## 📍 Truy cập hệ thống

### Local (không dùng Ngrok)
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8080/api
- **MinIO Storage**: http://localhost:8080/storage
- **MinIO Console**: http://localhost:8080/minio-console
- **Health Check**: http://localhost:8080/health

### Public (dùng Ngrok - dev only)
```bash
# Xem public URL
docker compose logs ngrok -f

# URL sẽ dạng: https://xxxx-xxx-xxx-xxx.ngrok-free.app
```

## 🔧 Quản lý container

### Xem logs
```bash
# Tất cả services
docker compose logs -f

# Service cụ thể
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
docker compose logs -f minio
```

### Restart service
```bash
docker compose restart backend
docker compose restart nginx
```

### Stop hệ thống
```bash
# Dừng (giữ data)
docker compose stop

# Dừng và xóa containers (giữ data)
docker compose down

# Dừng, xóa containers VÀ data
docker compose down -v
```

### Rebuild service cụ thể
```bash
# Rebuild backend
docker compose up -d --build backend

# Rebuild frontend
docker compose up -d --build frontend
```

## 🗄️ Quản lý Database

### Kết nối SQL Server từ bên ngoài (debug only)
```bash
# Thêm port mapping vào sqlserver service trong docker-compose.yml:
# ports:
#   - "1433:1433"

# Kết nối bằng:
# Server: localhost,1433
# User: sa
# Password: (từ .env SQL_SA_PASSWORD)
# Database: TutorCenterDb
```

### Backup database
```bash
docker exec tutor_sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "YourStrong@Password123" \
  -Q "BACKUP DATABASE TutorCenterDb TO DISK = N'/var/opt/mssql/backup/TutorCenterDb.bak'"

docker cp tutor_sqlserver:/var/opt/mssql/backup/TutorCenterDb.bak ./backup/
```

### Restore database
```bash
docker cp ./backup/TutorCenterDb.bak tutor_sqlserver:/var/opt/mssql/backup/

docker exec tutor_sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "YourStrong@Password123" \
  -Q "RESTORE DATABASE TutorCenterDb FROM DISK = N'/var/opt/mssql/backup/TutorCenterDb.bak' WITH REPLACE"
```

## 📦 Quản lý MinIO Storage

### Truy cập MinIO Console
```
URL: http://localhost:8080/minio-console
Username: minioadmin (hoặc từ .env)
Password: minioadmin123 (hoặc từ .env)
```

### Upload file qua API
```bash
# Upload file
curl -X POST http://localhost:8080/api/media/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.jpg"

# File sẽ được lưu vào MinIO bucket
```

### Truy cập file đã upload
```
URL: http://localhost:8080/storage/{bucket-name}/{file-name}
```

## 🔍 Troubleshooting

### Backend không kết nối được SQL Server
```bash
# Kiểm tra SQL Server đã chạy chưa
docker compose ps sqlserver

# Xem logs SQL Server
docker compose logs sqlserver

# Test kết nối
docker exec tutor_backend curl http://sqlserver:1433
```

### Backend không kết nối được MinIO
```bash
# Kiểm tra MinIO health
docker compose ps minio

# Test từ backend
docker exec tutor_backend curl http://minio:9000/minio/health/live
```

### Frontend không load được
```bash
# Kiểm tra build frontend
docker compose logs frontend

# Rebuild frontend
docker compose up -d --build frontend
```

### Nginx lỗi 502 Bad Gateway
```bash
# Kiểm tra backend/frontend đã chạy chưa
docker compose ps

# Xem logs nginx
docker compose logs nginx

# Restart nginx
docker compose restart nginx
```

### Ngrok không public được
```bash
# Kiểm tra authtoken
docker compose logs ngrok

# Chắc chắn đã thêm NGROK_AUTHTOKEN vào .env
# Chạy lại với profile dev
docker compose --profile dev up -d
```

## 📝 Development Workflow

### Update Backend Code
```bash
# 1. Sửa code backend
# 2. Rebuild backend
docker compose up -d --build backend

# 3. Xem logs
docker compose logs -f backend
```

### Update Frontend Code
```bash
# 1. Sửa code frontend
# 2. Rebuild frontend
docker compose up -d --build frontend

# 3. Clear browser cache và reload
```

### Update Database Schema
```bash
# 1. Chạy migration trong backend
docker exec tutor_backend dotnet ef database update

# Hoặc
# 2. Thực thi SQL script
docker exec tutor_sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "YourStrong@Password123" \
  -i /path/to/migration.sql
```

## 🔐 Security Notes (Production)

1. **Đổi tất cả passwords mặc định trong .env**
2. **Không commit file .env vào git**
3. **Sử dụng secrets management cho production**
4. **Tắt Ngrok trong production**
5. **Bật HTTPS cho Nginx trong production**
6. **Giới hạn CORS trong production**
7. **Tắt SQL Server port exposure (1433)**
8. **Tắt MinIO direct port exposure (9000, 9001)**

## 📚 Environment Variables Reference

Xem file `.env.example` để biết chi tiết tất cả các biến môi trường có thể cấu hình.

## 🆘 Support

Nếu gặp vấn đề:
1. Kiểm tra logs: `docker compose logs -f`
2. Kiểm tra health: `docker compose ps`
3. Restart services: `docker compose restart`
4. Rebuild: `docker compose up -d --build`

---

**Happy Coding! 🎉**
