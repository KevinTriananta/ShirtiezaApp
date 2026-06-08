# Shirtieza App

Shirtieza adalah aplikasi e-commerce dengan frontend React/Vite dan backend Go/GORM. Project ini berisi storefront, cart, checkout, order management, admin catalog, voucher, wishlist, wilayah Indonesia, dan upload bukti pembayaran manual.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Go, Gorilla Mux, GORM
- Database: PostgreSQL untuk production, MySQL untuk local jika dibutuhkan
- Deploy: Vercel untuk frontend, Render untuk backend

## Struktur

```txt
Shirtieza-app/
├── backend-shirtieza/      # Go API server
├── frontend-shirtieza/     # React frontend
├── render.yaml             # Render backend config
├── vercel.json             # Vercel frontend config
└── README.md
```

## Local Development

Install dependency frontend:

```bash
npm --prefix frontend-shirtieza install
```

Jalankan backend:

```bash
cd backend-shirtieza
go run cmd/main.go
```

Jalankan frontend:

```bash
npm --prefix frontend-shirtieza run dev
```

URL default:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080/api/v1`
- Health check: `http://localhost:8080/api/v1/health`

## Environment

Backend env utama ada di `backend-shirtieza/.env.example`:

```env
SERVER_ENV=development
SERVER_PORT=8080
DB_DRIVER=mysql
DATABASE_DSN=
JWT_SECRET=your_jwt_secret_key_here_change_in_production
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

Frontend env utama ada di `frontend-shirtieza/.env.example`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

## Scripts

Root scripts:

```bash
npm run dev
npm run build
npm run lint
npm run backend
```

Frontend scripts:

```bash
npm --prefix frontend-shirtieza run dev
npm --prefix frontend-shirtieza run build
npm --prefix frontend-shirtieza run lint
```

Backend verification:

```bash
cd backend-shirtieza
go test ./...
```

## Payment

Midtrans sudah dihapus. Checkout memakai metode manual seperti `bank_transfer`, `cod`, dan `ewallet`. Untuk pembayaran manual, user dapat upload bukti pembayaran dari halaman detail order, lalu admin mengonfirmasi status pembayaran.

## Deploy

Backend Render memakai `render.yaml`. Set env production berikut di Render:

```env
SERVER_ENV=production
DB_DRIVER=postgres
DATABASE_DSN=postgresql://...
JWT_SECRET=secret-panjang
ADMIN_EMAIL=admin@shirtieza.com
ADMIN_NAME=Shirtieza Admin
ADMIN_PASSWORD=password-kuat
CORS_ALLOWED_ORIGINS=https://domain-frontend.vercel.app
FRONTEND_URL=https://domain-frontend.vercel.app
```

Frontend Vercel memakai `vercel.json`. Set env berikut di Vercel:

```env
VITE_API_URL=https://domain-backend.onrender.com/api/v1
```

## Catatan Upload

Bukti pembayaran disimpan di folder lokal backend `uploads/payment-proofs`. Untuk production jangka panjang, gunakan storage permanen seperti Supabase Storage atau persistent disk Render.
