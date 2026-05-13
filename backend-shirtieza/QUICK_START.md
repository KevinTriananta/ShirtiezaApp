# Quick Start Guide untuk SHIRTIEZA Backend

## 📋 Prerequisites

Pastikan Anda sudah menginstall:
- Go 1.25.7 atau lebih tinggi
- Git
- (Optional) Docker & Docker Compose

## 🚀 Setup Lokal (Tanpa Docker)

### Step 1: Clone Repository
```bash
cd /path/to/shirtieza-app/backend-shirtieza
```

### Step 2: Install Dependencies
```bash
go mod download
go mod tidy
```

### Step 3: Setup Environment (Optional)
```bash
cp .env.example .env
# Edit .env sesuai kebutuhan Anda
```

### Step 4: Run Server
```bash
go run cmd/main.go
```

Server akan berjalan di `http://localhost:8080`

## 🐳 Setup dengan Docker

### Step 1: Build Image
```bash
docker build -t shirtieza-backend .
```

### Step 2: Run Container
```bash
docker run -p 8080:8080 shirtieza-backend
```

## 🐳 Setup dengan Docker Compose

### Step 1: Start Services
```bash
docker-compose up -d
```

### Step 2: Check Logs
```bash
docker-compose logs -f backend
```

### Step 3: Stop Services
```bash
docker-compose down
```

## 📊 Database

Database akan otomatis dibuat pada saat pertama kali server dijalankan.
File: `shirtieza.db` (SQLite)

### View Database
Untuk development, bisa menggunakan SQLite Browser atau tools lainnya.

## 🧪 Testing API

### Test dengan cURL

#### 1. Health Check
```bash
curl http://localhost:8080/api/v1/health
```

#### 2. Get All Products
```bash
curl http://localhost:8080/api/v1/products
```

#### 3. Register User
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 4. Get Categories
```bash
curl http://localhost:8080/api/v1/categories
```

## 📚 Useful Commands

### Build Project
```bash
make build
```

### Run Project
```bash
make run
```

### Format Code
```bash
make fmt
```

### Clean Build
```bash
make clean
```

## 📁 Project Structure

```
backend-shirtieza/
├── cmd/main.go              - Entry point
├── config/                  - Database & config
├── models/                  - Data models
├── handlers/                - API handlers
├── middleware/              - Middleware
├── routes/                  - Route definitions
├── utils/                   - Helper functions
├── go.mod                   - Dependencies
└── README.md                - Documentation
```

## 🔧 Development Workflow

### 1. Membuat Model Baru

Buat file di `models/` dengan nama yang sesuai:
```go
package models

type NewModel struct {
    ID    uint   `gorm:"primaryKey" json:"id"`
    Name  string `json:"name"`
    // ... fields lainnya
}
```

### 2. Membuat Handler

Buat file di `handlers/` untuk logika business:
```go
package handlers

func GetNewModels(w http.ResponseWriter, r *http.Request) {
    // Handle request
}
```

### 3. Mendaftarkan Routes

Update `routes/api_v1.go`:
```go
api.HandleFunc("/new-models", handlers.GetNewModels).Methods("GET")
```

### 4. Update Database

Database akan otomatis migrate model baru di `config/database.go`

## 🐛 Troubleshooting

### Port 8080 sudah digunakan
```bash
# Ganti port di cmd/main.go
# Atau kill process yang menggunakan port
lsof -i :8080
kill -9 <PID>
```

### Database corrupt/reset
```bash
# Delete database file
rm shirtieza.db

# Server akan membuat database baru saat dijalankan
```

### Go modules issue
```bash
# Clean & download dependencies
go clean -modcache
go mod download
go mod tidy
```

## 📝 Notes untuk Development

1. **Database**: Menggunakan SQLite untuk development. Untuk production, gunakan PostgreSQL/MySQL dengan mengubah config di `config/database.go`.

2. **Authentication**: Saat ini menggunakan placeholder. Implement JWT authentication di `middleware/auth.go`.

3. **Error Handling**: Gunakan `utils.RespondWithError()` untuk error responses.

4. **Success Responses**: Gunakan `utils.RespondWithSuccess()` untuk success responses.

5. **Database Queries**: Gunakan GORM methods untuk queries. Contoh:
   ```go
   config.DB.Where("id = ?", id).First(&model)
   config.DB.Where("name LIKE ?", "%search%").Find(&models)
   ```

## 🚀 Next Steps

1. Setup authentication dengan JWT
2. Implement file upload untuk product images
3. Add email notifications
4. Integrate payment gateway (Stripe, Midtrans, etc.)
5. Setup admin dashboard
6. Add product recommendations
7. Implement wishlist
8. Add search dengan Elasticsearch

## 📞 Support

Jika ada masalah atau pertanyaan, silakan:
1. Check dokumentasi di `README.md`
2. Check API documentation di `API_DOCUMENTATION.md`
3. Buat issue di repository

---

Happy coding! 🚀
