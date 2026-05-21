# SHIRTIEZA Backend - System Architecture

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React/Vite)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  HTTP/REST API Calls (JSON)                                      │
│                ▼                                                  │
├─────────────────────────────────────────────────────────────────┤
│                    Backend Server (Go)                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Routes Layer (Gorilla Mux)                               │   │
│  │ - REST endpoints                                         │   │
│  │ - Middleware application                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                        ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Middleware Layer                                         │   │
│  │ - CORS handling                                          │   │
│  │ - Authentication (JWT ready)                            │   │
│  │ - Logging (future)                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                        ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Handlers Layer (Business Logic)                          │   │
│  │ - Request validation                                    │   │
│  │ - Database operations                                   │   │
│  │ - Response formatting                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                        ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Models & ORM (GORM)                                      │   │
│  │ - Data models                                            │   │
│  │ - Database relationships                                │   │
│  │ - Migrations                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                        ▼                                          │
├─────────────────────────────────────────────────────────────────┤
│                    Database (SQLite/PostgreSQL)                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Folder Structure & Responsibilities

```
backend-shirtieza/
│
├── cmd/
│   └── main.go
│       └── Application entry point
│           - Initialize database
│           - Setup routes
│           - Apply middleware
│           - Start server
│
├── config/
│   ├── database.go
│   │   └── Database connection & setup
│   │       - GORM initialization
│   │       - Auto migrations
│   │       - Database close
│   │
│   └── seeder.go
│       └── Initial data seeding
│           - Categories
│           - Collections
│
├── models/
│   ├── user.go          → User entity with roles
│   ├── product.go       → Product entity with category/collection
│   ├── category.go      → Product category entity
│   ├── collection.go    → Product collection entity
│   ├── product_review.go → Product review/rating entity
│   ├── cart.go          → Cart & CartItem entities
│   └── order.go         → Order & OrderItem entities
│
├── handlers/
│   ├── product_handler.go
│   │   └── Product CRUD & queries
│   │       - GetAllProducts (with filters/pagination)
│   │       - GetProductByID
│   │       - CreateProduct (Admin)
│   │       - UpdateProduct (Admin)
│   │       - DeleteProduct (Admin)
│   │       - GetFeaturedProducts
│   │       - etc.
│   │
│   ├── category_handler.go
│   │   └── Category operations
│   │       - GetAllCategories
│   │       - GetCategoryByID
│   │       - CreateCategory (Admin)
│   │       - UpdateCategory (Admin)
│   │       - DeleteCategory (Admin)
│   │
│   ├── collection_handler.go
│   │   └── Collection operations
│   │       - GetAllCollections
│   │       - CreateCollection (Admin)
│   │       - AddProductToCollection (Admin)
│   │       - RemoveProductFromCollection (Admin)
│   │
│   ├── user_handler.go
│   │   └── User & authentication
│   │       - RegisterUser
│   │       - LoginUser
│   │       - GetUserProfile
│   │       - UpdateUserProfile
│   │       - GetUserOrders
│   │
│   ├── cart_handler.go
│   │   └── Shopping cart operations
│   │       - GetUserCart
│   │       - AddToCart
│   │       - UpdateCartItem
│   │       - RemoveFromCart
│   │       - ClearCart
│   │       - calculateCartTotal (helper)
│   │
│   └── order_handler.go
│       └── Order management
│           - CreateOrder
│           - GetOrderByID
│           - GetAllOrders (Admin)
│           - UpdateOrderStatus (Admin)
│           - CancelOrder
│           - generateOrderNumber (helper)
│
├── middleware/
│   ├── cors.go
│   │   └── CORS middleware
│   │       - Allow cross-origin requests
│   │       - Handle OPTIONS requests
│   │
│   └── auth.go
│       └── Authentication middleware (placeholder)
│           - JWT validation (future)
│           - User context injection (future)
│
├── routes/
│   ├── routes.go
│   │   └── Main router initialization
│   │       - Setup Gorilla Mux
│   │       - Apply middleware
│   │
│   └── api_v1.go
│       └── V1 API route definitions
│           - Product routes
│           - Category routes
│           - Collection routes
│           - User/Auth routes
│           - Cart routes
│           - Order routes
│
├── utils/
│   └── errors.go
│       └── Response helpers
│           - RespondWithError()
│           - RespondWithSuccess()
│
└── Documentation/
    ├── README.md                  → Project overview
    ├── API_DOCUMENTATION.md       → API endpoints & examples
    ├── QUICK_START.md             → Setup guide
    ├── ARCHITECTURE.md            → This file
    ├── DEVELOPMENT_CHECKLIST.md   → Progress tracking
    └── TESTING.md                 → Testing guide
```

## 🔄 Request Flow

### Example: Get All Products

```
1. HTTP Request
   GET /api/v1/products?page=1&sort_by=newest
   │
   ▼
2. Gorilla Mux Router
   - Matches route pattern
   - Calls appropriate handler
   │
   ▼
3. CORS Middleware
   - Adds CORS headers
   - Handles OPTIONS request
   │
   ▼
4. handlers.GetAllProducts()
   - Parse query parameters
   - Build database query
   │
   ▼
5. GORM ORM
   - Execute query on SQLite/PostgreSQL
   - Parse results into Product models
   │
   ▼
6. Response Formatting
   - Marshal models to JSON
   - Call utils.RespondWithSuccess()
   │
   ▼
7. HTTP Response
   {
     "message": "Products fetched successfully",
     "data": {...},
     "code": 200
   }
```

## 🗄️ Database Schema Relationships

### Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
├─────────────┤
│ id (PK)     │─────┐
│ name        │     │
│ email       │     │
│ password    │     │
└─────────────┘     │
       │            │
       │ 1──N       │
       │            │
   ┌───▼──────────┐ │
   │   Orders     │ │
   ├──────────────┤ │
   │ id (PK)      │ │
   │ user_id (FK) │◄┘
   │ total        │
   │ status       │
   └──────────────┘
       │
       │ 1──N
       │
   ┌───▼──────────┐      ┌─────────────┐
   │ Order Items  │      │  Products   │
   ├──────────────┤      ├─────────────┤
   │ id (PK)      │      │ id (PK)     │
   │ order_id(FK) │──────├ name        │
   │ product_id   │  N──1│ price       │
   │ quantity     │      │ category_id │
   └──────────────┘      │ stock       │
                         └─────────────┘
                              │
                              │ N──1
                              │
                         ┌────▼────────┐
                         │ Categories  │
                         ├─────────────┤
                         │ id (PK)     │
                         │ name        │
                         │ slug        │
                         └─────────────┘

Products M──N Collections (via collection_products)

┌────────────────┐
│ Collections    │
├────────────────┤
│ id (PK)        │
│ name           │
│ slug           │
└────────────────┘

┌──────────────┐
│    Carts     │
├──────────────┤
│ id (PK)      │
│ user_id (FK) │─────┐
│ total        │     │
└──────────────┘     │
                     │
                     │ 1──N
                     │
              ┌──────▼──────┐
              │ Cart Items  │
              ├─────────────┤
              │ id (PK)     │
              │ cart_id(FK) │
              │ product_id  │
              │ quantity    │
              └─────────────┘
```

## 🔐 Data Flow & Validation

### Request Validation Flow

```
Incoming Request
│
▼
CORS Check
├─ Origin validation
├─ Method validation
│
▼
Route Matching
├─ Find matching handler
├─ Extract URL parameters
├─ Parse query parameters
│
▼
Handler Processing
├─ Parse request body
├─ Validate input data
├─ Check required fields
│
▼
Database Operation
├─ Check permissions (future)
├─ Execute GORM query
├─ Handle database errors
│
▼
Response Formatting
├─ Format data
├─ Add metadata
├─ Return JSON
```

## 📊 Data Models Relationships

### User Relations
```
User (1) ─→ (N) Orders
User (1) ─→ (1) Cart
User (1) ─→ (N) Reviews
```

### Product Relations
```
Product (N) ─→ (1) Category
Product (N) ─→ (N) Collections
Product (1) ─→ (N) Reviews
Product (1) ─→ (N) CartItems
Product (1) ─→ (N) OrderItems
```

### Order Relations
```
Order (1) ─→ (N) OrderItems
Order (N) ─→ (1) User
OrderItem (N) ─→ (1) Product
```

### Cart Relations
```
Cart (1) ─→ (N) CartItems
CartItem (N) ─→ (1) Product
```

## 🔄 Business Logic Flow

### Shopping Cart → Order Flow

```
1. User adds product to cart
   ├─ Check if cart exists (create if not)
   ├─ Check if product exists
   ├─ Add/update cart item
   └─ Recalculate cart total

2. User views cart
   ├─ Fetch cart with all items
   ├─ Fetch product details for each item
   └─ Return complete cart data

3. User creates order
   ├─ Validate user & shipping address
   ├─ Calculate subtotal from cart items
   ├─ Add shipping cost & tax
   ├─ Create order record
   ├─ Create order items from cart items
   ├─ Generate unique order number
   ├─ Clear user's cart
   └─ Return order confirmation

4. Admin updates order status
   ├─ Fetch order
   ├─ Update status & payment info
   ├─ Return updated order
   └─ (Future: Send notification)
```

## 📡 API Versioning Strategy

```
/api/v1/      ← Current production API
  ├─ /products
  ├─ /categories
  ├─ /collections
  ├─ /users
  ├─ /cart
  ├─ /orders
  ├─ /auth
  └─ /admin
  
/api/v2/      ← Future API (when breaking changes needed)
```

## 🔒 Security Layers

```
Layer 1: CORS Middleware
  └─ Control allowed origins
  └─ Prevent unauthorized cross-origin requests

Layer 2: Input Validation (current)
  └─ Check required fields
  └─ Validate data types
  └─ Sanitize input

Layer 3: Authentication (future - JWT)
  └─ Token validation
  └─ User context injection

Layer 4: Authorization (future - RBAC)
  └─ Role-based access control
  └─ Admin endpoints protection

Layer 5: Database
  └─ GORM parameterized queries (SQL injection prevention)
  └─ Foreign key constraints
```

## 🚀 Performance Considerations

### Current Implementation
- Single database connection pool
- In-memory caching (future)
- Pagination for list endpoints (12 items default)
- Efficient GORM queries with Preload

### Future Optimizations
- Redis caching for frequently accessed data
- Database query optimization
- Elasticsearch for advanced search
- CDN for static assets
- Load balancing
- Database replication

## 📈 Scalability Strategy

### Horizontal Scaling
```
┌──────────────────────┐
│   Load Balancer      │
│   (nginx/HAProxy)    │
└──────────┬───────────┘
           │
    ┌──────┼──────┐
    │      │      │
  ┌─▼─┐ ┌─▼─┐ ┌─▼─┐
  │API│ │API│ │API│ (Multiple instances)
  └─┬─┘ └─┬─┘ └─┬─┘
    │     │     │
    └─────┼─────┘
          │
     ┌────▼──────┐
     │ PostgreSQL│ (Shared database)
     └───────────┘
```

### Vertical Scaling
- Increase server resources
- Optimize database indexes
- Implement caching layer

## 🔧 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Go 1.25.7 | Fast, compiled language |
| Web Framework | Gorilla Mux | HTTP routing |
| ORM | GORM | Database abstraction |
| Database | SQLite/PostgreSQL | Data persistence |
| Middleware | Custom | CORS, Auth |
| Response Formatting | encoding/json | JSON serialization |

## 📝 Design Patterns Used

### 1. **Handler Pattern**
- Each resource has dedicated handler package
- Clean separation of concerns

### 2. **Middleware Pattern**
- CORS middleware
- Auth middleware (ready for implementation)

### 3. **Repository Pattern** (via GORM)
- ORM abstracts database operations
- Easy to switch databases

### 4. **Dependency Injection**
- Global DB instance in config
- Imported in handlers

### 5. **Error Handling Pattern**
- Centralized response formatting
- Consistent error responses

## 🔄 Update & Migration Strategy

### Adding New Endpoint

```
1. Create model (if needed)
   └─ models/new_model.go

2. Create handler
   └─ handlers/new_model_handler.go

3. Add routes
   └─ Update routes/api_v1.go

4. Database migration
   └─ Auto-migrate in config/database.go

5. Test endpoint
   └─ Manual test or unit test
```

### Database Changes

```
1. Update model in models/
2. GORM auto-migration handles schema changes
3. Seed new data if needed in config/seeder.go
4. No manual SQL migrations needed
```

## 🧪 Testing Strategy

### Unit Tests (future)
- Test handlers with mock database
- Test utility functions

### Integration Tests (future)
- Test with real database
- Test complete workflows

### E2E Tests (future)
- API integration tests
- Full user journeys

## 📚 Key Principles

1. **DRY (Don't Repeat Yourself)**
   - Centralized response formatting
   - Shared middleware

2. **SOLID Principles**
   - Single responsibility per handler
   - Dependency injection ready

3. **RESTful API Design**
   - Standard HTTP methods
   - Proper status codes
   - JSON response format

4. **Error Handling**
   - Consistent error responses
   - Meaningful error messages

5. **Security**
   - Input validation
   - CORS protection
   - Future JWT implementation

---

## 🚀 Deployment Topology

### Development
```
Local Machine
└─ Go server + SQLite
```

### Production
```
┌─────────────────────────────────┐
│    CDN (Static Assets)           │
└────────────────┬────────────────┘
                 │
┌────────────────▼─────────────────┐
│    Load Balancer (nginx)         │
└────────────┬──────────┬──────────┘
             │          │
        ┌────▼──┐  ┌────▼──┐
        │ API 1 │  │ API 2 │ (Docker Containers)
        └────┬──┘  └────┬──┘
             │          │
        ┌────▼──────────▼──┐
        │   PostgreSQL DB   │ (Managed Service)
        └───────────────────┘
```

---

This architecture is designed to be:
- **Scalable**: Ready for horizontal scaling
- **Maintainable**: Clear separation of concerns
- **Testable**: Mockable dependencies
- **Secure**: Multiple security layers
- **Performant**: Efficient queries and caching ready

---

Last updated: January 2026
