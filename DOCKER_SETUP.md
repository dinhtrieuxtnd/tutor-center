# Docker Setup - Tutor Center

Hướng dẫn cài đặt và sử dụng Docker cho dự án Tutor Center.

## Yêu cầu

- Docker Desktop hoặc Docker Engine
- Docker Compose v3.8+

## Các dịch vụ

### 1. SQL Server
- **Image**: mcr.microsoft.com/mssql/server:2022-latest
- **Port**: 1433
- **Credentials**:
  - Username: `sa`
  - Password: `YourStrong@Password123`
- **Database**: TutorCenterDb (tự động tạo từ file SQL)

### 2. MinIO (S3-compatible storage)
- **Image**: minio/minio:latest
- **Ports**:
  - API: 9000
  - Console: 9001
- **Credentials**:
  - Access Key: `minioadmin`
  - Secret Key: `minioadmin`
- **Default Bucket**: `tutor-center`

## Khởi động dịch vụ

### Khởi động tất cả dịch vụ
```bash
docker-compose up -d
```

### Khởi động từng dịch vụ riêng lẻ
```bash
# Chỉ SQL Server
docker-compose up -d sqlserver

# Chỉ MinIO
docker-compose up -d minio
```

### Xem logs
```bash
# Tất cả dịch vụ
docker-compose logs -f

# SQL Server
docker-compose logs -f sqlserver

# MinIO
docker-compose logs -f minio
```

## Kiểm tra kết nối

### SQL Server
```bash
# Kiểm tra từ command line
docker exec -it tutor-center-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123" -Q "SELECT @@VERSION"
```

Hoặc kết nối từ ứng dụng với connection string:
```
Server=localhost,1433;Database=TutorCenterDb;User Id=sa;Password=YourStrong@Password123;TrustServerCertificate=True;
```

### MinIO
- **Console UI**: http://localhost:9001
- **API Endpoint**: http://localhost:9000
- Login với credentials: `minioadmin` / `minioadmin`

## Khởi tạo Database

Database sẽ tự động được tạo khi container khởi động lần đầu. Tuy nhiên, bạn cần chạy script SQL thủ công:

```bash
# Copy file SQL vào container
docker cp TutorCenterBackend/complete_db_setup.sql tutor-center-sqlserver:/tmp/

# Chạy script SQL
docker exec -it tutor-center-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123" -i /tmp/complete_db_setup.sql
```

Hoặc sử dụng SQL Server Management Studio (SSMS) hoặc Azure Data Studio để kết nối và chạy file SQL.

## Cập nhật appsettings.json

Sau khi khởi động Docker, cập nhật file `appsettings.json` trong backend:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=TutorCenterDb;User Id=sa;Password=YourStrong@Password123;TrustServerCertificate=True;"
  },
  "S3Storage": {
    "ServiceUrl": "http://localhost:9000",
    "AccessKey": "minioadmin",
    "SecretKey": "minioadmin",
    "DefaultBucket": "tutor-center",
    "Region": "us-east-1"
  }
}
```

## Dừng và xóa dịch vụ

```bash
# Dừng các container
docker-compose stop

# Dừng và xóa containers
docker-compose down

# Dừng, xóa containers VÀ xóa volumes (mất dữ liệu)
docker-compose down -v
```

## Backup và Restore

### Backup SQL Server
```bash
# Backup database
docker exec tutor-center-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123" -Q "BACKUP DATABASE TutorCenterDb TO DISK = '/var/opt/mssql/backup/TutorCenterDb.bak'"

# Copy backup ra ngoài
docker cp tutor-center-sqlserver:/var/opt/mssql/backup/TutorCenterDb.bak ./backup/
```

### Backup MinIO
```bash
# MinIO data được lưu trong volume minio_data
docker run --rm -v tutor-center_minio_data:/data -v $(pwd)/backup:/backup alpine tar czf /backup/minio-backup.tar.gz -C /data .
```

## Troubleshooting

### SQL Server không khởi động
- Kiểm tra password đủ mạnh (ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt)
- Kiểm tra port 1433 chưa bị sử dụng
- Xem logs: `docker-compose logs sqlserver`

### MinIO không thể upload file
- Kiểm tra bucket đã được tạo chưa
- Kiểm tra CORS configuration
- Xem logs: `docker-compose logs minio`

### Kết nối từ backend bị lỗi
- Nếu backend chạy trong Docker: dùng tên service (`sqlserver`, `minio`)
- Nếu backend chạy ngoài Docker: dùng `localhost`

## Network Configuration

Tất cả services đều chạy trong network `tutor-center-network`. Nếu muốn backend cũng chạy trong Docker và kết nối với các services này, thêm vào docker-compose:

```yaml
  backend:
    build: ./TutorCenterBackend
    depends_on:
      - sqlserver
      - minio
    networks:
      - tutor-center-network
```

Và cập nhật connection strings sử dụng service names thay vì localhost.
