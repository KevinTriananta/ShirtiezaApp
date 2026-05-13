#!/bin/bash

# Shirtieza Quick Start Script
# Run this script to setup both backend and frontend

echo "🚀 Shirtieza E-Commerce - Quick Start"
echo "========================================"
echo ""

# Check if Node.js is installed
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak terinstall. Silakan install Node.js terlebih dahulu."
    exit 1
fi
echo "✅ Node.js $(node --version) terdeteksi"

# Check if Go is installed
echo ""
echo "Checking Go..."
if ! command -v go &> /dev/null; then
    echo "❌ Go tidak terinstall. Silakan install Go terlebih dahulu."
    exit 1
fi
echo "✅ Go $(go version | awk '{print $3}') terdeteksi"

echo ""
echo "========================================"
echo "📦 Installing Frontend Dependencies..."
echo "========================================"
cd frontend-shirtieza
npm install

if [ $? -ne 0 ]; then
    echo "❌ Frontend installation gagal"
    exit 1
fi
echo "✅ Frontend dependencies installed"

echo ""
echo "========================================"
echo "✨ Setup Berhasil!"
echo "========================================"
echo ""
echo "Sekarang jalankan di dua terminal berbeda:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend-shirtieza"
echo "  go run cmd/main.go"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend-shirtieza"
echo "  npm run dev"
echo ""
echo "Kemudian buka: http://localhost:5173"
echo ""
