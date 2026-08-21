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
