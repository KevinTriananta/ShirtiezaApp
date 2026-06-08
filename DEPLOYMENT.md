# Panduan Deploy Shirtieza Untuk Pemula

Panduan ini menjelaskan cara deploy project Shirtieza dengan:

- Frontend React/Vite ke Vercel
- Backend Go ke Render
- Database PostgreSQL ke Supabase

Ikuti urutan ini dari atas ke bawah. Jangan lompat langkah, karena frontend membutuhkan URL backend, dan backend membutuhkan URL frontend untuk CORS.

## 1. Pahami Struktur Project

Project ini punya dua bagian utama:

```txt
Shirtieza-app/
frontend-shirtieza/   -> aplikasi frontend React
backend-shirtieza/    -> aplikasi backend Go API
vercel.json           -> konfigurasi deploy frontend ke Vercel
render.yaml           -> konfigurasi deploy backend ke Render
```

Backend akan menyediakan API seperti:

```txt
https://nama-backend.onrender.com/api/v1
```

Frontend akan diakses user dari domain Vercel seperti:

```txt
https://nama-frontend.vercel.app
```

## 2. Siapkan Akun Yang Dibutuhkan

Buat akun jika belum punya:

- GitHub: untuk menyimpan repo project
- Supabase: untuk database
- Render: untuk backend Go
- Vercel: untuk frontend React

Pastikan project ini sudah ada di GitHub. Render dan Vercel akan mengambil source code dari GitHub.

## 3. Cek Build Lokal Sebelum Deploy

Buka terminal di folder root project:

```bash
cd /Users/veetaasdhi/Documents/Shirtieza-app
```

Cek build frontend:

```bash
npm --prefix frontend-shirtieza run build
```

Cek build backend:

```bash
cd backend-shirtieza
go build -o main ./cmd
cd ..
```

Jika dua command di atas berhasil tanpa error, project siap deploy.

## 4. Buat Database Di Supabase

1. Buka Supabase.
2. Klik `New project`.
3. Isi nama project, contoh `shirtieza`.
4. Buat password database yang kuat dan simpan password itu.
5. Pilih region terdekat, misalnya Singapore jika tersedia.
6. Klik `Create new project`.
7. Tunggu sampai project selesai dibuat.

Setelah project aktif:

1. Buka `Project Settings`.
2. Buka menu `Database`.
3. Cari bagian `Connection string`.
4. Pilih connection string untuk `Transaction pooler` atau `Session pooler`.
5. Copy connection string tersebut.

Contoh bentuk connection string:

```env
postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require
```

Ganti `PASSWORD` dengan password database Supabase kamu.

Penting: pastikan bagian akhir connection string punya `sslmode=require`.

## 5. Deploy Backend Ke Render

1. Buka Render.
2. Klik `New`.
3. Pilih `Web Service`.
4. Connect GitHub jika belum pernah connect.
5. Pilih repository project Shirtieza.
6. Isi konfigurasi service seperti berikut.

Konfigurasi Render:

```txt
Name: shirtieza-backend
Runtime: Go
Root Directory: backend-shirtieza
Build Command: go build -o main ./cmd
Start Command: ./main
```

Jika Render membaca `render.yaml`, beberapa konfigurasi bisa otomatis terisi. Tetap cek nilainya agar sama seperti di atas.

## 6. Isi Environment Variables Backend Di Render

Di halaman service Render, buka menu `Environment`.

Tambahkan env berikut satu per satu:

```env
SERVER_ENV=production
DB_DRIVER=postgres
DATABASE_DSN=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require
JWT_SECRET=ganti-dengan-random-secret-panjang
ADMIN_EMAIL=admin@shirtieza.com
ADMIN_NAME=Shirtieza Admin
ADMIN_PASSWORD=ganti-dengan-password-admin-yang-kuat
CORS_ALLOWED_ORIGINS=https://sementara.vercel.app
FRONTEND_URL=https://sementara.vercel.app
```

Penjelasan env penting:

- `DATABASE_DSN` adalah connection string dari Supabase.
- `JWT_SECRET` dipakai untuk token login user.
- `ADMIN_EMAIL` adalah email login admin.
- `ADMIN_PASSWORD` adalah password login admin.
- `CORS_ALLOWED_ORIGINS` nanti harus diganti dengan domain Vercel asli.
- `FRONTEND_URL` nanti harus diganti dengan domain Vercel asli.

Untuk `JWT_SECRET`, gunakan teks random panjang. Contoh:

```txt
shirtieza-production-secret-2026-ganti-dengan-yang-lebih-random
```

Untuk sementara, `CORS_ALLOWED_ORIGINS` dan `FRONTEND_URL` boleh pakai placeholder dulu karena domain Vercel belum ada. Nanti setelah frontend deploy, bagian ini wajib diganti.

## 7. Jalankan Deploy Backend

1. Klik `Deploy Web Service` di Render.
2. Tunggu proses build selesai.
3. Jika sukses, Render akan memberi URL backend.

Contoh URL backend:

```txt
https://shirtieza-backend.onrender.com
```

Test backend dengan membuka URL ini di browser:

```txt
https://shirtieza-backend.onrender.com/api/v1/health
```

Jika berhasil, hasilnya seperti ini:

```json
{"status":"healthy"}
```

Simpan URL backend Render. Kamu akan memakainya di Vercel.

## 8. Deploy Frontend Ke Vercel

1. Buka Vercel.
2. Klik `Add New`.
3. Pilih `Project`.
4. Import repository project Shirtieza dari GitHub.
5. Jika Vercel bertanya framework, pilih `Vite`.
6. Pastikan root directory adalah root repository, bukan `frontend-shirtieza`.

Project ini sudah punya `vercel.json`, jadi Vercel akan memakai konfigurasi berikut:

```txt
Install Command: npm --prefix frontend-shirtieza install
Build Command: npm --prefix frontend-shirtieza run build
Output Directory: frontend-shirtieza/dist
```

Sebelum klik deploy, buka bagian `Environment Variables` di Vercel.

Tambahkan env frontend:

```env
VITE_API_URL=https://shirtieza-backend.onrender.com/api/v1
```

Ganti `https://shirtieza-backend.onrender.com` dengan URL backend Render kamu.

Klik `Deploy`.

## 9. Ambil Domain Frontend Vercel

Setelah deploy frontend sukses, Vercel akan memberi domain.

Contoh domain frontend:

```txt
https://shirtieza.vercel.app
```

Simpan domain ini. Kamu perlu memasukkannya kembali ke Render.

## 10. Update CORS Backend Di Render

Kembali ke Render backend service.

Buka menu `Environment`, lalu update env berikut:

```env
CORS_ALLOWED_ORIGINS=https://shirtieza.vercel.app
FRONTEND_URL=https://shirtieza.vercel.app
```

Ganti `https://shirtieza.vercel.app` dengan domain Vercel kamu.

Penting:

- Harus pakai `https://`.
- Jangan tambahkan slash `/` di akhir URL.
- Domain harus sama persis dengan domain frontend yang kamu buka di browser.

Setelah env diubah, klik `Manual Deploy` lalu pilih `Deploy latest commit`.

## 11. Test Aplikasi Setelah Deploy

Buka frontend Vercel:

```txt
https://shirtieza.vercel.app
```

Lakukan test berikut:

1. Buka homepage.
2. Klik halaman products.
3. Register user baru.
4. Login sebagai user.
5. Tambahkan produk ke cart.
6. Checkout.
7. Login admin memakai `ADMIN_EMAIL` dan `ADMIN_PASSWORD`.
8. Buka admin dashboard.
9. Cek order yang masuk.
10. Update status order.

Jika semua berjalan, deploy berhasil.

## 12. Catatan Penting Tentang Upload Bukti Pembayaran

Saat ini bukti pembayaran disimpan di folder lokal backend:

```txt
uploads/payment-proofs
```

Render free service tidak cocok untuk penyimpanan file permanen. File bisa hilang ketika service restart atau redeploy.

Untuk production jangka panjang, gunakan salah satu solusi ini:

1. Supabase Storage untuk menyimpan bukti pembayaran.
2. Render persistent disk jika memakai plan Render berbayar.

Untuk testing awal, sistem upload masih bisa dicoba, tetapi jangan anggap file upload aman permanen.

## 13. Troubleshooting Umum

Jika frontend tidak bisa mengambil data dari backend:

```txt
Kemungkinan: VITE_API_URL salah atau CORS belum benar.
```

Solusi:

1. Cek `VITE_API_URL` di Vercel.
2. Pastikan nilainya seperti `https://backend.onrender.com/api/v1`.
3. Cek `CORS_ALLOWED_ORIGINS` di Render.
4. Pastikan nilainya sama dengan domain Vercel.
5. Redeploy frontend jika env Vercel berubah.
6. Redeploy backend jika env Render berubah.

Jika backend gagal deploy di Render:

```txt
Kemungkinan: DATABASE_DSN salah atau password database salah.
```

Solusi:

1. Copy ulang connection string Supabase.
2. Pastikan password database benar.
3. Pastikan ada `sslmode=require`.
4. Pastikan `DB_DRIVER=postgres`.
5. Deploy ulang backend.

Jika login admin gagal:

```txt
Kemungkinan: ADMIN_PASSWORD belum diset saat pertama deploy.
```

Solusi:

1. Set `ADMIN_EMAIL` di Render.
2. Set `ADMIN_PASSWORD` di Render.
3. Redeploy backend.
4. Login ulang memakai email dan password tersebut.

Jika domain Vercel berubah:

```txt
Update lagi CORS_ALLOWED_ORIGINS dan FRONTEND_URL di Render.
```

## 14. Checklist Final

Pastikan semua ini sudah selesai:

- Supabase project sudah dibuat.
- `DATABASE_DSN` Supabase sudah dimasukkan ke Render.
- Backend Render berhasil deploy.
- Health endpoint backend berhasil dibuka.
- Frontend Vercel berhasil deploy.
- `VITE_API_URL` di Vercel mengarah ke backend Render.
- `CORS_ALLOWED_ORIGINS` di Render mengarah ke domain Vercel.
- User bisa register dan login.
- Admin bisa login.
- Cart dan checkout bisa digunakan.

Jika checklist ini sudah terpenuhi, Shirtieza sudah berhasil online.
