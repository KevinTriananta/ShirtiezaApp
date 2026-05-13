# SHIRTIEZA Backend API

Backend e-commerce SHIRTIEZA dibangun dengan Golang, GORM, dan SQLite.

## 📋 Struktur Folder

```
backend-shirtieza/
├── cmd/
│   └── main.go              # Entry point aplikasi
├── config/
│   ├── database.go          # Database connection & setup
│   └── seeder.go            # Database seeding (initial data)
├── models/
│   ├── user.go              # User model
│   ├── product.go           # Product model
│   ├── category.go          # Category model
│   ├── collection.go        # Collection model
│   ├── product_review.go    # Product review model
│   ├── cart.go              # Cart & CartItem models
│   └── order.go             # Order & OrderItem models
├── handlers/
│   ├── product_handler.go   # Product CRUD & queries
│   ├── category_handler.go  # Category CRUD & queries
│   ├── collection_handler.go # Collection CRUD & queries
│   ├── user_handler.go      # User auth & profile
│   ├── cart_handler.go      # Shopping cart operations
│   └── order_handler.go     # Order management
├── middleware/
│   ├── cors.go              # CORS middleware
│   └── auth.go              # Auth middleware (JWT ready)
├── routes/
│   ├── routes.go            # Main router setup
│   └── api_v1.go            # V1 API routes definition
├── utils/
│   └── errors.go            # Error & success response helpers
├── go.mod                   # Go module definition
└── go.sum                   # Go module checksums
```

## 🗄️ Database Tables

### Users
- `id` - Primary key
- `name`, `email` (unique), `password`
- `phone`, `address`, `city`, `country`, `zip_code`
- `avatar`, `role` (admin/customer)
- `created_at`, `updated_at`, `deleted_at`

### Products
- `id` - Primary key
- `name`, `slug` (unique), `description`
- `price`, `discount_price`, `stock`
- `image`, `images` (JSON array)
- `rating`, `review_count`
- `category_id` - Foreign key
- `created_at`, `updated_at`, `deleted_at`

### Categories
- `id` - Primary key
- `name`, `slug` (unique), `icon`, `image`
- `description`
- `created_at`, `updated_at`, `deleted_at`

### Collections
- `id` - Primary key
- `name`, `slug` (unique), `image`
- `description`, `is_active`
- `created_at`, `updated_at`, `deleted_at`
- Many-to-many relationship dengan Products

### Orders
- `id` - Primary key
- `order_number` (unique), `user_id`
- `shipping_address`, `shipping_city`, `shipping_country`, `shipping_zip`
- `subtotal`, `shipping_cost`, `tax`, `total`
- `status` (pending/processing/shipped/delivered/cancelled)
- `payment_status` (paid/unpaid/refunded), `payment_method`
- `notes`
- `created_at`, `updated_at`, `deleted_at`

### Order Items
- `id` - Primary key
- `order_id`, `product_id` (Foreign keys)
- `quantity`, `price` (Price saat pembelian)
- `created_at`, `updated_at`, `deleted_at`

### Carts
- `id` - Primary key
- `user_id` (unique)
- `total`
- `created_at`, `updated_at`, `deleted_at`

### Cart Items
- `id` - Primary key
- `cart_id`, `product_id` (Foreign keys)
- `quantity`, `price` (Price saat ditambahkan)
- `created_at`, `updated_at`, `deleted_at`

### Product Reviews
- `id` - Primary key
- `product_id`, `user_id` (Foreign keys)
- `rating` (1-5), `comment`
- `helpful` (count)
- `created_at`, `updated_at`, `deleted_at`

## 🚀 Setup & Running

### Prerequisites
- Go 1.25.7 atau lebih tinggi
- Git

### Installation

```bash
# Clone repository
cd backend-shirtieza

# Install dependencies
go mod download

# Run server
go run cmd/main.go
```

Server akan berjalan di `http://localhost:8080`

## 📡 API Endpoints

### Products
```
GET    /api/v1/products                    - Get all products (with pagination/filter)
GET    /api/v1/products/featured           - Get featured products
GET    /api/v1/products/{id}               - Get product by ID
GET    /api/v1/products/slug/{slug}        - Get product by slug
GET    /api/v1/products/category/{id}      - Get products by category
GET    /api/v1/products/collection/{id}    - Get products by collection
POST   /api/v1/admin/products              - Create product (Admin)
PUT    /api/v1/admin/products/{id}         - Update product (Admin)
DELETE /api/v1/admin/products/{id}         - Delete product (Admin)
```

### Categories
```
GET    /api/v1/categories                  - Get all categories
GET    /api/v1/categories/{id}             - Get category by ID
GET    /api/v1/categories/slug/{slug}      - Get category by slug
GET    /api/v1/categories/{id}/stats       - Get category statistics
POST   /api/v1/admin/categories            - Create category (Admin)
PUT    /api/v1/admin/categories/{id}       - Update category (Admin)
DELETE /api/v1/admin/categories/{id}       - Delete category (Admin)
```

### Collections
```
GET    /api/v1/collections                 - Get all collections
GET    /api/v1/collections/{id}            - Get collection by ID
GET    /api/v1/collections/slug/{slug}     - Get collection by slug
POST   /api/v1/admin/collections           - Create collection (Admin)
PUT    /api/v1/admin/collections/{id}      - Update collection (Admin)
DELETE /api/v1/admin/collections/{id}      - Delete collection (Admin)
POST   /api/v1/admin/collections/{id}/products/{pid}    - Add product to collection
DELETE /api/v1/admin/collections/{id}/products/{pid}    - Remove product from collection
```

### Authentication
```
POST   /api/v1/auth/register               - Register user
POST   /api/v1/auth/login                  - Login user
```

### Users
```
GET    /api/v1/users/{id}                  - Get user profile
PUT    /api/v1/users/{id}                  - Update user profile
GET    /api/v1/users/{id}/orders           - Get user orders
```

### Shopping Cart
```
GET    /api/v1/cart/{user_id}              - Get user cart
POST   /api/v1/cart/{user_id}/add          - Add item to cart
PUT    /api/v1/cart/item/{item_id}         - Update cart item quantity
DELETE /api/v1/cart/item/{item_id}         - Remove item from cart
DELETE /api/v1/cart/{user_id}/clear        - Clear entire cart
```

### Orders
```
POST   /api/v1/orders                      - Create order
GET    /api/v1/orders/{id}                 - Get order details
GET    /api/v1/admin/orders                - Get all orders (Admin)
PUT    /api/v1/admin/orders/{id}/status    - Update order status (Admin)
PUT    /api/v1/admin/orders/{id}/cancel    - Cancel order
```

## 📊 Query Parameters

### Products List
```
GET /api/v1/products?page=1&page_size=12&category=1&search=hoodie&sort_by=price_desc
```
- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 12, max: 100)
- `category` - Filter by category ID
- `search` - Search by name or description
- `sort_by` - Sort option: price_asc, price_desc, newest, rating

## 📝 Example Requests

### Register User
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### Create Product (Admin)
```bash
curl -X POST http://localhost:8080/api/v1/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Men BLVCK Gray Hoodie",
    "slug": "men-blvck-gray-hoodie",
    "description": "Comfortable gray hoodie",
    "price": 180000,
    "image": "url-to-image",
    "stock": 50,
    "category_id": 1
  }'
```

### Add to Cart
```bash
curl -X POST http://localhost:8080/api/v1/cart/1/add \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

### Create Order
```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "shipping_address": "123 Main St",
    "shipping_city": "Jakarta",
    "shipping_country": "Indonesia",
    "shipping_zip": "12345",
    "shipping_cost": 50000,
    "tax": 18000,
    "payment_method": "bank_transfer",
    "items": [
      {"product_id": 1, "quantity": 2}
    ]
  }'
```

## 🔄 Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": {},
  "code": 200
}
```

### Error Response
```json
{
  "message": "Error message",
  "error": "Detailed error",
  "code": 400
}
```

## 🔐 Future Enhancements

- [ ] JWT authentication
- [ ] Admin authentication & authorization
- [ ] Product image upload
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Product filtering & advanced search
- [ ] Wishlist feature
- [ ] Product recommendations
- [ ] Admin dashboard
- [ ] Order tracking
- [ ] Inventory management
- [ ] Discount codes/coupons

## 📚 Technologies Used

- **Go 1.25.7** - Programming language
- **GORM** - Object-relational mapping
- **SQLite** - Database
- **Gorilla Mux** - HTTP router
- **RS CORS** - CORS handling

## 📄 License

MIT License

## 👥 Support

Untuk pertanyaan atau masalah, silakan buat issue di repository ini.
