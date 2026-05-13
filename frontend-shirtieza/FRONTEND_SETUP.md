# Shirtieza Frontend

Frontend aplikasi e-commerce Shirtieza yang modern dan responsif, dibangun dengan React, TypeScript, Tailwind CSS, dan terintegrasi penuh dengan backend API.

## 🚀 Fitur

✅ **Authentication & Authorization**
- Register dan Login dengan JWT
- Protected routes
- Auto-logout saat token expired
- Persistent login state

✅ **Shopping Experience**
- Browsing produk dengan pagination
- Pencarian dan filter by kategori
- Detail produk dengan rating dan review
- Shopping cart management
- Order checkout dan history

✅ **E-Commerce Features**
- Featured products di homepage
- Kategori dan Collections
- Product recommendations
- Quick add to cart
- Wishlist placeholder

✅ **User Management**
- Profile management
- Order history
- Address book
- Personal data update

✅ **Responsive Design**
- Mobile-first approach
- Desktop, tablet, mobile support
- Touch-friendly interface

## 📋 Prerequisites

- Node.js 18+ dan npm/yarn
- Backend server berjalan di `http://localhost:8080`

## ⚙️ Setup

### 1. Install Dependencies

```bash
cd frontend-shirtieza
npm install
```

### 2. Configure Environment

Copy `.env.example` menjadi `.env` dan sesuaikan jika perlu:

```bash
cp .env.example .env
```

File `.env`:
```
VITE_API_URL=http://localhost:8080/api/v1
```

### 3. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173`

### 4. Build untuk Production

```bash
npm run build
```

## 🧪 Testing dengan Backend

### Quick Start Checklist

1. **Start Backend**
   ```bash
   cd ../backend-shirtieza
   go run cmd/main.go
   ```

2. **Start Frontend**
   ```bash
   cd frontend-shirtieza
   npm run dev
   ```

3. **Access Application**
   - Open browser: `http://localhost:5173`

### Test User Flow

#### 1. Register Account
- Klik "Register" di homepage
- Isi form dengan data lengkap
- Submit
- Auto login dan redirect ke homepage

#### 2. Browse Products
- Klik "Shop Now" atau "Products" di navbar
- Lihat semua produk dengan pagination
- Filter by kategori
- Klik product card untuk detail

#### 3. View Product Detail
- Lihat gambar, deskripsi, rating, harga
- Cek stock availability
- Add to cart dengan quantity

#### 4. Shopping Cart
- Klik shopping cart icon di navbar
- View items dengan total harga
- Update quantity atau remove items
- Klik "Proceed to Checkout"

#### 5. Checkout & Orders
- Shipping info auto-populated dari profile
- Review order summary
- Click "Checkout" untuk create order
- Redirect ke order detail page

#### 6. View Orders
- Klik profile icon atau "Profile" di navbar
- Lihat order history
- Klik order untuk detail lengkap

#### 7. Categories & Collections
- Klik "Categories" di navbar
- Browse kategori dengan icon
- Klik untuk lihat produk di kategori
- Same untuk Collections

### Test Scenarios

#### Scenario 1: Guest User
1. Browse homepage
2. Lihat featured products
3. Click "Add to Cart" → redirect ke login
4. Register atau login
5. Lanjut berbelanja

#### Scenario 2: Auth & Cart
1. Login dengan existing account
2. Add multiple products ke cart
3. Lihat cart count badge update
4. Go to cart page
5. Modify quantities
6. Checkout

#### Scenario 3: Orders
1. Create order (checkout)
2. Go to profile
3. View order history
4. Click order untuk detail
5. Check shipping address dan status

#### Scenario 4: Profile Management
1. Go to Profile
2. Edit personal information
3. Save changes
4. View orders history

### API Integration Points

Frontend mengintegrasikan dengan endpoints backend:

**Products:**
- `GET /products` - List all products (pagination, filter, search)
- `GET /products/{id}` - Product detail
- `GET /products/slug/{slug}` - Product by slug
- `GET /products/featured` - Featured products
- `GET /products/category/{id}` - Products by category
- `GET /products/collection/{id}` - Products by collection

**Categories:**
- `GET /categories` - All categories
- `GET /categories/{id}` - Category detail
- `GET /categories/slug/{slug}` - Category by slug
- `GET /categories/{id}/stats` - Category stats

**Collections:**
- `GET /collections` - All collections
- `GET /collections/{id}` - Collection detail
- `GET /collections/slug/{slug}` - Collection by slug

**Auth:**
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user

**Users:**
- `GET /users/{id}` - Get user profile
- `PUT /users/{id}` - Update profile
- `GET /users/{id}/orders` - User orders

**Cart:**
- `GET /cart/{user_id}` - Get cart
- `POST /cart/{user_id}/add` - Add to cart
- `PUT /cart/item/{item_id}` - Update cart item
- `DELETE /cart/item/{item_id}` - Remove from cart
- `DELETE /cart/{user_id}/clear` - Clear cart

**Orders:**
- `POST /orders` - Create order
- `GET /orders/{id}` - Get order detail
- `GET /users/{id}/orders` - User orders

## 📁 Project Structure

```
frontend-shirtieza/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── Header.tsx   # Navigation header
│   │   │   ├── Footer.tsx   # Footer
│   │   │   └── ProductCard.tsx # Product card component
│   │   └── features/        # Feature-specific components
│   │
│   ├── pages/               # Route pages
│   │   ├── HomePage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── CollectionsPage.tsx
│   │   ├── CollectionPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── OrderDetailPage.tsx
│   │
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx  # Auth state management
│   │   └── CartContext.tsx  # Cart state management
│   │
│   ├── services/            # API services
│   │   ├── api.ts          # Axios instance
│   │   ├── productService.ts
│   │   ├── categoryService.ts
│   │   ├── collectionService.ts
│   │   ├── authService.ts
│   │   ├── cartService.ts
│   │   ├── orderService.ts
│   │   └── userService.ts
│   │
│   ├── types/              # TypeScript types
│   │   └── index.ts        # All type definitions
│   │
│   ├── config/             # Configuration
│   │   └── env.ts          # Environment config
│   │
│   ├── utils/              # Utility functions
│   ├── routes/             # Route definitions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
│
├── public/                 # Static assets
├── .env                    # Environment variables
├── .env.example            # Example env file
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🎨 Styling

Menggunakan **Tailwind CSS** untuk styling:
- Utility-first CSS framework
- Responsive design classes
- Custom colors dan components
- Dark mode support ready

## 🔐 Security

- JWT token stored di localStorage (untuk demo)
- Auto token refresh ready untuk implementation
- Protected routes dengan auth context
- CORS configured di backend

**Untuk Production:**
- Gunakan HttpOnly cookies untuk token
- Implement refresh token mechanism
- Add CSRF protection
- Sanitize user inputs

## 🚀 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Environment Variables

```
VITE_API_URL     # Backend API base URL (default: http://localhost:8080/api/v1)
```

### Browser DevTools

Install React Developer Tools untuk debug:
- Check component state
- Monitor context changes
- Inspect props

## 📱 Responsive Breakpoints

- Mobile: 320px - 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+

## 🐛 Troubleshooting

### API Connection Issues

**Problem:** "Failed to fetch" di console
**Solution:**
1. Verify backend is running: `http://localhost:8080/api/v1/health`
2. Check CORS headers di backend
3. Verify `.env` file points ke correct API URL

### Auth Issues

**Problem:** Logout saat refresh page
**Solution:**
- Check localStorage untuk `auth_token` dan `auth_user`
- Verify token masih valid
- Clear localStorage: `localStorage.clear()` di console

### Cart Not Persisting

**Problem:** Cart kosong setelah refresh
**Solution:**
- Must be logged in untuk save cart di backend
- Cart data loaded dari API saat login
- Check user ID di localStorage

### CORS Errors

**Problem:** CORS error saat call API
**Solution:**
1. Backend harus include CORS headers
2. Verify request headers di Network tab
3. Check middleware configuration

## 📚 Additional Resources

- [React Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Axios Docs](https://axios-http.com)

## 🎓 Learning Path

1. Understand React components dan hooks
2. Learn React Router untuk navigation
3. Explore Tailwind CSS utility classes
4. Study API integration dengan Axios
5. Implement state management dengan Context API
6. Build responsive UI dengan mobile-first

## 📝 Notes

- Authentification menggunakan simple JWT (localStorage)
- Untuk production, gunakan secure cookies
- API base URL configurable via `.env`
- All components fully typed dengan TypeScript
- Responsive design tested di major browsers

## 🤝 Support

Untuk issues atau questions:
1. Check backend documentation
2. Verify API responses di browser Network tab
3. Check browser console untuk errors
4. Review TypeScript types untuk endpoint data

## 📄 License

Shirtieza Frontend © 2024

---

**Happy Coding! 🚀**
