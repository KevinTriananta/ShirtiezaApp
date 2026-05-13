#!/bin/bash

# Shirtieza Deployment Script
echo "🚀 Starting Shirtieza Deployment Process..."

# 1. Build Backend
echo "📦 Building Backend..."
cd backend-shirtieza
go build -o server cmd/main.go
echo "✅ Backend built successfully."
cd ..

# 2. Build Frontend
echo "📦 Building Frontend..."
cd frontend-shirtieza
npm install
npm run build
echo "✅ Frontend built successfully."
cd ..

echo "------------------------------------------------"
echo "✨ Build Complete!"
echo "------------------------------------------------"
echo "To run the application in production:"
echo "1. Backend: cd backend-shirtieza && ./server"
echo "2. Frontend: Serve the 'frontend-shirtieza/dist' folder using Nginx or any static hosting."
echo "------------------------------------------------"
