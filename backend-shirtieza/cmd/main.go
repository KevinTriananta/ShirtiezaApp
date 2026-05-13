package main

import (
	"fmt"
	"log"
	"net/http"

	"backend-shirtieza/config"
	"backend-shirtieza/middleware"
	"backend-shirtieza/routes"
)

func main() {
	// Initialize database
	config.InitDB()
	config.SeedDatabase()
	defer config.CloseDB()

	router := routes.SetupRoutes()

	finalHandler := middleware.EnableCORS(router)

	//Server configuration
	port := ":8080"

	fmt.Println("========================================")
	fmt.Printf("🚀 Server starting on %s\n", port)
	fmt.Println("📚 API Documentation:")
	fmt.Println("   - GET  /api/v1/products           - Get all products")
	fmt.Println("   - GET  /api/v1/products/:id        - Get product by ID")
	fmt.Println("   - GET  /api/v1/categories          - Get all categories")
	fmt.Println("   - GET  /api/v1/collections         - Get all collections")
	fmt.Println("   - POST /api/v1/auth/register       - Register user")
	fmt.Println("   - POST /api/v1/auth/login          - Login user")
	fmt.Println("   - GET  /api/v1/cart/{user_id}      - Get user cart")
	fmt.Println("   - POST /api/v1/orders              - Create order")
	fmt.Println("========================================")
	fmt.Println("")

	// Gunakan finalHandler, bukan router langsung
	if err := http.ListenAndServe(port, finalHandler); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
