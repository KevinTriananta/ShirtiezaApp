# SHIRTIEZA Backend API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication Headers
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN} (future implementation)
```

---

## Products API

### Get All Products
```http
GET /products?page=1&page_size=12&sort_by=newest
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Items per page (default: 12, max: 100)
- `category` (optional): Filter by category ID
- `search` (optional): Search by name or description
- `sort_by` (optional): price_asc | price_desc | newest | rating

**Response:**
```json
{
  "message": "Products fetched successfully",
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Men BLVCK Gray Hoodie",
        "slug": "men-blvck-gray-hoodie",
        "description": "Comfortable gray hoodie",
        "price": 180000,
        "discount_price": 150000,
        "image": "url",
        "stock": 50,
        "rating": 4.5,
        "review_count": 23,
        "category": {
          "id": 1,
          "name": "Hoodie",
          "slug": "hoodie"
        },
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 50,
    "page": 1,
    "page_size": 12,
    "total_pages": 5
  },
  "code": 200
}
```

### Get Product by ID
```http
GET /products/1
```

**Response:**
```json
{
  "message": "Product fetched successfully",
  "data": {
    "id": 1,
    "name": "Men BLVCK Gray Hoodie",
    "slug": "men-blvck-gray-hoodie",
    "description": "Comfortable gray hoodie",
    "price": 180000,
    "discount_price": 150000,
    "image": "url",
    "stock": 50,
    "rating": 4.5,
    "review_count": 23,
    "category": {
      "id": 1,
      "name": "Hoodie"
    },
    "collections": [
      {
        "id": 1,
        "name": "Men Collection"
      }
    ],
    "reviews": []
  },
  "code": 200
}
```

### Get Product by Slug
```http
GET /products/slug/men-blvck-gray-hoodie
```

### Get Featured Products
```http
GET /products/featured
```

### Get Products by Category
```http
GET /products/category/1
```

### Create Product (Admin)
```http
POST /admin/products
Content-Type: application/json

{
  "name": "Men BLVCK Gray Hoodie",
  "slug": "men-blvck-gray-hoodie",
  "description": "Comfortable gray hoodie for men",
  "price": 180000,
  "discount_price": 150000,
  "image": "https://example.com/image.jpg",
  "images": "[\"url1\", \"url2\"]",
  "stock": 50,
  "category_id": 1
}
```

### Update Product (Admin)
```http
PUT /admin/products/1
Content-Type: application/json

{
  "name": "Men BLVCK Gray Hoodie Updated",
  "price": 175000,
  "stock": 45
}
```

### Delete Product (Admin)
```http
DELETE /admin/products/1
```

---

## Categories API

### Get All Categories
```http
GET /categories
```

**Response:**
```json
{
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Hoodie",
      "slug": "hoodie",
      "icon": "👕",
      "description": "Comfortable hoodies",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "code": 200
}
```

### Get Category by ID
```http
GET /categories/1
```

### Get Category by Slug
```http
GET /categories/slug/hoodie
```

### Get Category Statistics
```http
GET /categories/1/stats
```

**Response:**
```json
{
  "message": "Category stats fetched successfully",
  "data": {
    "category": {...},
    "product_count": 15
  },
  "code": 200
}
```

### Create Category (Admin)
```http
POST /admin/categories
Content-Type: application/json

{
  "name": "Hoodie",
  "slug": "hoodie",
  "icon": "👕",
  "description": "Comfortable hoodies",
  "image": "url"
}
```

### Update Category (Admin)
```http
PUT /admin/categories/1
Content-Type: application/json

{
  "name": "Hoodie Updated",
  "description": "New description"
}
```

### Delete Category (Admin)
```http
DELETE /admin/categories/1
```

---

## Collections API

### Get All Collections
```http
GET /collections
```

### Get Collection by ID
```http
GET /collections/1
```

### Get Collection by Slug
```http
GET /collections/slug/men-collection
```

### Create Collection (Admin)
```http
POST /admin/collections
Content-Type: application/json

{
  "name": "Men Collection",
  "slug": "men-collection",
  "description": "Exclusive collection for men",
  "image": "url",
  "is_active": true
}
```

### Update Collection (Admin)
```http
PUT /admin/collections/1
Content-Type: application/json

{
  "name": "Men Collection Updated",
  "is_active": true
}
```

### Delete Collection (Admin)
```http
DELETE /admin/collections/1
```

### Add Product to Collection (Admin)
```http
POST /admin/collections/1/products/5
```

### Remove Product from Collection (Admin)
```http
DELETE /admin/collections/1/products/5
```

---

## Authentication API

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+6281234567890",
  "address": "123 Main Street",
  "city": "Jakarta",
  "country": "Indonesia",
  "zip_code": "12345"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+6281234567890",
    "address": "123 Main Street",
    "city": "Jakarta",
    "country": "Indonesia",
    "avatar": "",
    "role": "customer"
  },
  "code": 201
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "JWT_TOKEN_HERE"
  },
  "code": 200
}
```

---

## Users API

### Get User Profile
```http
GET /users/1
```

### Update User Profile
```http
PUT /users/1
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+6281234567890",
  "address": "456 Oak Street",
  "city": "Bandung"
}
```

### Get User Orders
```http
GET /users/1/orders
```

---

## Shopping Cart API

### Get User Cart
```http
GET /cart/1
```

**Response:**
```json
{
  "message": "Cart fetched successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "total": 360000,
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Men BLVCK Gray Hoodie",
          "price": 180000,
          "image": "url"
        },
        "quantity": 2,
        "price": 180000
      }
    ]
  },
  "code": 200
}
```

### Add to Cart
```http
POST /cart/1/add
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

### Update Cart Item
```http
PUT /cart/item/1
Content-Type: application/json

{
  "quantity": 3
}
```

### Remove from Cart
```http
DELETE /cart/item/1
```

### Clear Cart
```http
DELETE /cart/1/clear
```

---

## Orders API

### Create Order
```http
POST /orders
Content-Type: application/json

{
  "user_id": 1,
  "shipping_address": "123 Main Street",
  "shipping_city": "Jakarta",
  "shipping_country": "Indonesia",
  "shipping_zip": "12345",
  "shipping_cost": 50000,
  "tax": 18000,
  "payment_method": "bank_transfer",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "order_number": "ORD-1704067200000000000",
    "user_id": 1,
    "shipping_address": "123 Main Street",
    "shipping_city": "Jakarta",
    "shipping_country": "Indonesia",
    "shipping_zip": "12345",
    "subtotal": 360000,
    "shipping_cost": 50000,
    "tax": 18000,
    "total": 428000,
    "status": "pending",
    "payment_status": "unpaid",
    "payment_method": "bank_transfer",
    "items": [
      {
        "id": 1,
        "order_id": 1,
        "product_id": 1,
        "quantity": 2,
        "price": 180000
      }
    ],
    "created_at": "2024-01-01T00:00:00Z"
  },
  "code": 201
}
```

### Get Order by ID
```http
GET /orders/1
```

### Get All Orders (Admin)
```http
GET /admin/orders
```

### Update Order Status (Admin)
```http
PUT /admin/orders/1/status
Content-Type: application/json

{
  "status": "processing",
  "payment_status": "paid",
  "notes": "Order is being prepared"
}
```

### Cancel Order
```http
PUT /admin/orders/1/cancel
```

---

## Error Responses

### Bad Request (400)
```json
{
  "message": "Invalid request payload",
  "error": "EOF",
  "code": 400
}
```

### Not Found (404)
```json
{
  "message": "Product not found",
  "error": "record not found",
  "code": 404
}
```

### Internal Server Error (500)
```json
{
  "message": "Failed to fetch products",
  "error": "database connection error",
  "code": 500
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200  | OK |
| 201  | Created |
| 400  | Bad Request |
| 404  | Not Found |
| 500  | Internal Server Error |

---

## Tips for Testing

### Using cURL
```bash
# Get all products
curl http://localhost:8080/api/v1/products

# Create a product (Admin)
curl -X POST http://localhost:8080/api/v1/admin/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":100000,"category_id":1}'

# Register user
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123"}'
```

### Using Postman
1. Import the API endpoints
2. Set base URL: `http://localhost:8080/api/v1`
3. Test each endpoint with provided examples

---

## Future Endpoints (To be implemented)

- [ ] Product reviews: POST, PUT, DELETE
- [ ] Wishlist management
- [ ] Product recommendations
- [ ] Search with Elasticsearch
- [ ] Advanced filtering
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Admin analytics dashboard
