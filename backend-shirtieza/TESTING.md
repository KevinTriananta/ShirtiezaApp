# SHIRTIEZA Backend - Postman Collection

Dokumentasi lengkap untuk testing API dengan Postman.

## Import ke Postman

1. Buka Postman
2. Click "Import"
3. Pilih "Raw text"
4. Copy paste collection JSON di bawah ini
5. Click "Import"

## Collection JSON

```json
{
  "info": {
    "name": "SHIRTIEZA Backend API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Products",
      "item": [
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:8080/api/v1/products?page=1&page_size=12&sort_by=newest",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["api", "v1", "products"],
              "query": [
                {"key": "page", "value": "1"},
                {"key": "page_size", "value": "12"},
                {"key": "sort_by", "value": "newest"}
              ]
            },
            "header": [
              {"key": "Content-Type", "value": "application/json"}
            ]
          }
        },
        {
          "name": "Get Product by ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:8080/api/v1/products/1",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["api", "v1", "products", "1"]
            },
            "header": [
              {"key": "Content-Type", "value": "application/json"}
            ]
          }
        }
      ]
    },
    {
      "name": "Categories",
      "item": [
        {
          "name": "Get All Categories",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:8080/api/v1/categories",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["api", "v1", "categories"]
            }
          }
        }
      ]
    },
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": {
              "raw": "http://localhost:8080/api/v1/auth/register",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["api", "v1", "auth", "register"]
            },
            "header": [
              {"key": "Content-Type", "value": "application/json"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": {
              "raw": "http://localhost:8080/api/v1/auth/login",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["api", "v1", "auth", "login"]
            },
            "header": [
              {"key": "Content-Type", "value": "application/json"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
            }
          }
        }
      ]
    }
  ]
}
```

## Manual Testing Routes

### 1. Health Check
```
GET http://localhost:8080/api/v1/health
```

### 2. Products

#### Get All Products
```
GET http://localhost:8080/api/v1/products
GET http://localhost:8080/api/v1/products?page=1&page_size=12&sort_by=newest
GET http://localhost:8080/api/v1/products?search=hoodie&sort_by=price_desc
GET http://localhost:8080/api/v1/products?category=1
```

#### Get Product by ID
```
GET http://localhost:8080/api/v1/products/1
```

#### Get Product by Slug
```
GET http://localhost:8080/api/v1/products/slug/men-blvck-gray-hoodie
```

#### Create Product (Admin)
```
POST http://localhost:8080/api/v1/admin/products
Content-Type: application/json

{
  "name": "Men BLVCK Gray Hoodie",
  "slug": "men-blvck-gray-hoodie",
  "description": "Comfortable gray hoodie",
  "price": 180000,
  "image": "https://example.com/image.jpg",
  "stock": 50,
  "category_id": 1
}
```

### 3. Categories

#### Get All Categories
```
GET http://localhost:8080/api/v1/categories
```

#### Get Category by ID
```
GET http://localhost:8080/api/v1/categories/1
```

#### Create Category (Admin)
```
POST http://localhost:8080/api/v1/admin/categories
Content-Type: application/json

{
  "name": "Hoodie",
  "slug": "hoodie",
  "icon": "👕",
  "description": "Comfortable hoodies"
}
```

### 4. Collections

#### Get All Collections
```
GET http://localhost:8080/api/v1/collections
```

#### Get Collection by ID
```
GET http://localhost:8080/api/v1/collections/1
```

### 5. Authentication

#### Register User
```
POST http://localhost:8080/api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

#### Login User
```
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 6. User Profile

#### Get User Profile
```
GET http://localhost:8080/api/v1/users/1
```

#### Update User Profile
```
PUT http://localhost:8080/api/v1/users/1
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+1234567890"
}
```

#### Get User Orders
```
GET http://localhost:8080/api/v1/users/1/orders
```

### 7. Shopping Cart

#### Get Cart
```
GET http://localhost:8080/api/v1/cart/1
```

#### Add to Cart
```
POST http://localhost:8080/api/v1/cart/1/add
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

#### Update Cart Item
```
PUT http://localhost:8080/api/v1/cart/item/1
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove from Cart
```
DELETE http://localhost:8080/api/v1/cart/item/1
```

### 8. Orders

#### Create Order
```
POST http://localhost:8080/api/v1/orders
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
    }
  ]
}
```

#### Get Order
```
GET http://localhost:8080/api/v1/orders/1
```

#### Get All Orders (Admin)
```
GET http://localhost:8080/api/v1/admin/orders
```

#### Update Order Status (Admin)
```
PUT http://localhost:8080/api/v1/admin/orders/1/status
Content-Type: application/json

{
  "status": "processing",
  "payment_status": "paid",
  "notes": "Order is being prepared"
}
```

---

## Testing Workflow

### 1. Setup Data
1. Create categories
2. Create products
3. Create collections
4. Register users

### 2. User Journey
1. Register user
2. Login
3. Add products to cart
4. Create order
5. Check order status

### 3. Admin Operations
1. Create/Edit products
2. Create/Edit categories
3. Manage collections
4. Update order status

---

## Environment Variables (Postman)

Dalam Postman, bisa set environment variables:

```
base_url: http://localhost:8080
api_version: v1
user_id: 1
product_id: 1
category_id: 1
collection_id: 1
order_id: 1
```

Kemudian gunakan dalam requests:

```
GET {{base_url}}/api/{{api_version}}/products/{{product_id}}
```

---

## Tips Testing

1. **Urutkan testing**: Health check → Categories → Products → Users → Orders
2. **Gunakan variables**: Copy ID dari response dan gunakan di request berikutnya
3. **Test error cases**: Missing fields, invalid IDs, etc.
4. **Monitor performance**: Check response time
5. **Save responses**: Keep important responses untuk referensi

---

Happy testing! 🚀
