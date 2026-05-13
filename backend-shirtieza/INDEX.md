# 📚 SHIRTIEZA Backend Documentation Index

Selamat datang! Ini adalah index lengkap untuk semua dokumentasi SHIRTIEZA Backend.

---

## 🚀 Mulai Dari Sini

### Baru Memulai?
1. **[QUICK_START.md](QUICK_START.md)** - Setup & running dalam 5 menit
2. **[README.md](README.md)** - Project overview
3. **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Explore all endpoints

### Sudah Familiar?
1. **[STRUCTURE_SUMMARY.md](STRUCTURE_SUMMARY.md)** - What's included
2. **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design
3. **[IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)** - Next steps

---

## 📖 Dokumentasi Lengkap

### Setup & Running
| File | Tujuan | Read Time |
|------|--------|-----------|
| [QUICK_START.md](QUICK_START.md) | Setup lokal & Docker | 5 min |
| [README.md](README.md) | Project overview & features | 10 min |
| [Makefile](Makefile) | Build commands | - |
| [docker-compose.yml](docker-compose.yml) | Docker setup | - |

### API & Endpoints
| File | Tujuan | Read Time |
|------|--------|-----------|
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Semua endpoints dengan contoh | 20 min |
| [TESTING.md](TESTING.md) | Testing guide & Postman | 10 min |
| [routes/api_v1.go](routes/api_v1.go) | Route definitions | - |

### Architecture & Design
| File | Tujuan | Read Time |
|------|--------|-----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design & flows | 15 min |
| [STRUCTURE_SUMMARY.md](STRUCTURE_SUMMARY.md) | What's implemented | 10 min |
| [DEVELOPMENT_CHECKLIST.md](DEVELOPMENT_CHECKLIST.md) | Progress tracking | 5 min |

### Development Guide
| File | Tujuan | Read Time |
|------|--------|-----------|
| [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) | Next phases & features | 15 min |
| [DATABASE TABLES](#database-schema) | Schema reference | 5 min |
| [CODE STRUCTURE](#folder-structure) | File organization | 5 min |

---

## 🗂️ Folder Structure

```
backend-shirtieza/
│
├── 📄 Documentation Files
│   ├── README.md
│   ├── API_DOCUMENTATION.md
│   ├── QUICK_START.md
│   ├── ARCHITECTURE.md
│   ├── STRUCTURE_SUMMARY.md
│   ├── IMPLEMENTATION_ROADMAP.md
│   ├── DEVELOPMENT_CHECKLIST.md
│   ├── TESTING.md
│   └── INDEX.md (this file)
│
├── 🔧 Config Files
│   ├── go.mod
│   ├── go.sum
│   ├── Makefile
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .gitignore
│   └── .env.example
│
├── 📁 Source Code
│   ├── cmd/
│   │   └── main.go              ← Start here
│   ├── config/
│   │   ├── database.go          ← Database setup
│   │   └── seeder.go            ← Initial data
│   ├── models/                  ← 9 data models
│   ├── handlers/                ← 35+ API functions
│   ├── middleware/              ← CORS & Auth
│   ├── routes/                  ← Route definitions
│   └── utils/                   ← Helper functions
│
└── 📊 Database
    └── shirtieza.db             ← Auto-created
```

---

## 📊 Database Schema

### Tables Overview
```
Users (1) ─→ (N) Orders
Users (1) ─→ (1) Carts
Users (1) ─→ (N) Reviews

Products (N) ─→ (1) Categories
Products (N) ↔ (N) Collections
Products (1) ─→ (N) CartItems
Products (1) ─→ (N) OrderItems

Orders (1) ─→ (N) OrderItems
Carts (1) ─→ (N) CartItems
```

### 9 Tables
1. **users** - User accounts with roles
2. **products** - Product catalog
3. **categories** - Product categories
4. **collections** - Product collections
5. **collection_products** - Many-to-many
6. **product_reviews** - Reviews & ratings
7. **carts** - Shopping carts
8. **cart_items** - Cart items
9. **orders** - Order records
10. **order_items** - Order items

See: [README.md](README.md) for detailed schema

---

## 🔗 API Endpoints (40+ Total)

### By Category

**Products** (9 endpoints)
```
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/admin/products
...
```

**Categories** (7 endpoints)
```
GET    /api/v1/categories
GET    /api/v1/categories/:id
POST   /api/v1/admin/categories
...
```

**Collections** (8 endpoints)
```
GET    /api/v1/collections
POST   /api/v1/collections
...
```

**Auth** (2 endpoints)
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
```

**Users** (5 endpoints)
```
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
...
```

**Cart** (5 endpoints)
```
GET    /api/v1/cart/:user_id
POST   /api/v1/cart/:user_id/add
...
```

**Orders** (5 endpoints)
```
POST   /api/v1/orders
GET    /api/v1/orders/:id
...
```

See: [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete reference

---

## 🚀 Quick Commands

### Installation
```bash
# Download dependencies
go mod download

# Run server
go run cmd/main.go

# Or using make
make run
```

### Docker
```bash
# Start with docker-compose
docker-compose up -d

# Stop services
docker-compose down
```

### Testing
```bash
# Get all products
curl http://localhost:8080/api/v1/products

# Register user
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123"}'
```

See: [QUICK_START.md](QUICK_START.md) for more

---

## 📚 Reading Path by Role

### 👨‍💻 For Developers

1. **First Time?**
   - [QUICK_START.md](QUICK_START.md) - Setup
   - [README.md](README.md) - Overview
   - [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Endpoints

2. **Deep Dive**
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Design
   - Review source code in `handlers/` & `models/`
   - [DEVELOPMENT_CHECKLIST.md](DEVELOPMENT_CHECKLIST.md) - What's done

3. **Making Changes**
   - [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - Next features
   - Follow Phase guidelines
   - Update documentation

### 👨‍💼 For Project Managers

1. **Overview**
   - [README.md](README.md) - What exists
   - [STRUCTURE_SUMMARY.md](STRUCTURE_SUMMARY.md) - Summary

2. **Progress**
   - [DEVELOPMENT_CHECKLIST.md](DEVELOPMENT_CHECKLIST.md) - Status
   - [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - Next steps

3. **Timeline**
   - [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - Phase timeline

### 🧪 For QA / Testers

1. **Testing**
   - [TESTING.md](TESTING.md) - How to test
   - [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - All endpoints
   - Postman collection in [TESTING.md](TESTING.md)

2. **Test Cases**
   - Use endpoints in API_DOCUMENTATION.md
   - Test data creation documented
   - Error cases documented

### 📊 For DevOps

1. **Deployment**
   - [QUICK_START.md](QUICK_START.md) - Local setup
   - [Dockerfile](Dockerfile) - Container image
   - [docker-compose.yml](docker-compose.yml) - Compose setup
   - [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md#-phase-8-deployment-production) - Production

2. **Configuration**
   - [.env.example](.env.example) - Environment variables
   - Database migration - handled by code
   - [Makefile](Makefile) - Build commands

---

## 🎯 Common Tasks

### "I want to run the server"
→ [QUICK_START.md](QUICK_START.md)

### "I want to test the API"
→ [TESTING.md](TESTING.md)

### "I want to understand the code"
→ [ARCHITECTURE.md](ARCHITECTURE.md)

### "I want to add a new feature"
→ [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)

### "I want to understand the database"
→ [README.md](README.md) (Database Tables section)

### "I want to deploy this"
→ [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md#-phase-8-deployment-production)

### "I want to see all endpoints"
→ [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

### "I need to know what's implemented"
→ [STRUCTURE_SUMMARY.md](STRUCTURE_SUMMARY.md)

---

## 📈 Documentation Stats

| Type | Count | Total |
|------|-------|-------|
| Documentation Files | 8 | |
| Total Documentation Pages | ~60 | |
| Code Files | 20+ | |
| Total Lines of Code | 2000+ | |
| API Endpoints | 40+ | |
| Database Tables | 10 | |
| Models | 9 | |
| Handlers | 6 | |

---

## ✨ Features at a Glance

### ✅ Implemented
- [x] User registration & login (basic)
- [x] Product catalog with search/filter/pagination
- [x] Categories & collections
- [x] Shopping cart
- [x] Order management
- [x] User profiles
- [x] 40+ API endpoints
- [x] Complete documentation
- [x] Docker support
- [x] Database migrations

### 🔄 Recommended Next (Phase 2+)
- [ ] JWT authentication
- [ ] Password hashing
- [ ] File upload for images
- [ ] Email notifications
- [ ] Advanced search
- [ ] Admin dashboard
- [ ] Payment integration

See: [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)

---

## 🔍 Quick Reference

### Environment Variables
```
PORT=8080
DB_DRIVER=sqlite
SERVER_ENV=development
```
See: [.env.example](.env.example)

### Build Commands
```
make run         # Run server
make build       # Build binary
make test        # Run tests
make clean       # Clean build
```
See: [Makefile](Makefile)

### Key Models
- **User** - Authentication & profiles
- **Product** - Main product model
- **Category** - Product categories
- **Collection** - Product collections
- **Order** - Order management
- **Cart** - Shopping cart

See: [models/](models/) folder

### Key Handlers
- **product_handler.go** - Product operations
- **category_handler.go** - Category operations
- **user_handler.go** - User & auth
- **cart_handler.go** - Cart operations
- **order_handler.go** - Order management

See: [handlers/](handlers/) folder

---

## 🤔 FAQ

**Q: How do I run the server?**
A: See [QUICK_START.md](QUICK_START.md)

**Q: How do I test the API?**
A: See [TESTING.md](TESTING.md)

**Q: What endpoints are available?**
A: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

**Q: How is the code organized?**
A: See [ARCHITECTURE.md](ARCHITECTURE.md)

**Q: What's the next step?**
A: See [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)

**Q: Is this production-ready?**
A: Foundation is ready. See [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) for hardening.

**Q: How do I add a new feature?**
A: See [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)

---

## 📞 Support

### Getting Help
1. Check the relevant documentation above
2. Review code comments
3. Check QUICK_START.md for troubleshooting
4. Review ARCHITECTURE.md for design questions

### Updates to Documentation
- Check this INDEX.md for latest changes
- All files updated: January 2024

---

## 🎓 Learning Resources

### Go
- https://golang.org
- https://tour.golang.org

### GORM
- https://gorm.io

### REST API
- https://restfulapi.net

### Database Design
- https://www.postgresql.org/docs/

### JWT
- https://jwt.io

---

## 🎉 You're All Set!

Pilih dokumentasi yang sesuai dengan kebutuhan Anda dan mulai:

1. **Getting Started?** → [QUICK_START.md](QUICK_START.md)
2. **Want to code?** → [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Want to test?** → [TESTING.md](TESTING.md)
4. **Want to deploy?** → [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)

Happy coding! 🚀

---

**Last Updated:** January 2024  
**Status:** ✅ Complete & Ready to Use  
**Maintainer:** SHIRTIEZA Team

For the latest updates, check the repository.
