package routes

import (
	"net/http"

	"backend-shirtieza/handlers"
	"backend-shirtieza/middleware"

	"github.com/gorilla/mux"
)

func SetupV1Routes(router *mux.Router) {
	// Public API v1 routes
	api := router.PathPrefix("/api/v1").Subrouter()

	// Admin Subrouter with Middleware
	admin := api.PathPrefix("/admin").Subrouter()
	admin.Use(middleware.AdminMiddleware)

	// ============ PRODUCTS ============
	api.HandleFunc("/products", handlers.GetAllProducts).Methods("GET")
	api.HandleFunc("/products/featured", handlers.GetFeaturedProducts).Methods("GET")
	api.HandleFunc("/products/{id}", handlers.GetProductByID).Methods("GET")
	api.HandleFunc("/products/slug/{slug}", handlers.GetProductBySlug).Methods("GET")
	api.HandleFunc("/products/category/{category_id}", handlers.GetProductsByCategory).Methods("GET")
	api.HandleFunc("/products/collection/{collection_id}", handlers.GetProductsByCollection).Methods("GET")

	// Admin routes for products
	admin.HandleFunc("/products", handlers.CreateProduct).Methods("POST")
	admin.HandleFunc("/products/{id}", handlers.UpdateProduct).Methods("PUT")
	admin.HandleFunc("/products/{id}", handlers.DeleteProduct).Methods("DELETE")

	// ============ CATEGORIES ============
	api.HandleFunc("/categories", handlers.GetAllCategories).Methods("GET")
	api.HandleFunc("/categories/{id}", handlers.GetCategoryByID).Methods("GET")
	api.HandleFunc("/categories/slug/{slug}", handlers.GetCategoryBySlug).Methods("GET")
	api.HandleFunc("/categories/{id}/stats", handlers.GetCategoryStats).Methods("GET")

	// Admin routes for categories
	admin.HandleFunc("/categories", handlers.CreateCategory).Methods("POST")
	admin.HandleFunc("/categories/{id}", handlers.UpdateCategory).Methods("PUT")
	admin.HandleFunc("/categories/{id}", handlers.DeleteCategory).Methods("DELETE")

	// ============ COLLECTIONS ============
	api.HandleFunc("/collections", handlers.GetAllCollections).Methods("GET")
	api.HandleFunc("/collections/{id}", handlers.GetCollectionByID).Methods("GET")
	api.HandleFunc("/collections/slug/{slug}", handlers.GetCollectionBySlug).Methods("GET")

	// Admin routes for collections
	admin.HandleFunc("/collections", handlers.CreateCollection).Methods("POST")
	admin.HandleFunc("/collections/{id}", handlers.UpdateCollection).Methods("PUT")
	admin.HandleFunc("/collections/{id}", handlers.DeleteCollection).Methods("DELETE")
	admin.HandleFunc("/collections/{collection_id}/products/{product_id}", handlers.AddProductToCollection).Methods("POST")
	admin.HandleFunc("/collections/{collection_id}/products/{product_id}", handlers.RemoveProductFromCollection).Methods("DELETE")

	// ============ USERS ============
	api.HandleFunc("/auth/register", handlers.RegisterUser).Methods("POST")
	api.HandleFunc("/auth/login", handlers.LoginUser).Methods("POST")
	api.HandleFunc("/users/{id}", handlers.GetUserProfile).Methods("GET")
	api.HandleFunc("/users/{id}", handlers.UpdateUserProfile).Methods("PUT")
	api.HandleFunc("/users/{id}/orders", handlers.GetUserOrders).Methods("GET")

	// Admin routes for users
	admin.HandleFunc("/users", handlers.GetAllUsers).Methods("GET")
	admin.HandleFunc("/stats", handlers.GetAdminStats).Methods("GET")

	// ============ CART ============
	api.HandleFunc("/cart/{user_id}", handlers.GetUserCart).Methods("GET")
	api.HandleFunc("/cart/{user_id}/add", handlers.AddToCart).Methods("POST")
	api.HandleFunc("/cart/item/{item_id}", handlers.UpdateCartItem).Methods("PUT")
	api.HandleFunc("/cart/item/{item_id}", handlers.RemoveFromCart).Methods("DELETE")
	api.HandleFunc("/cart/{user_id}/clear", handlers.ClearCart).Methods("DELETE")

	// ============ ORDERS ============
	api.HandleFunc("/orders", handlers.CreateOrder).Methods("POST")
	api.HandleFunc("/orders/{id}", handlers.GetOrderByID).Methods("GET")

	// Admin routes for orders
	api.HandleFunc("/admin/orders", handlers.GetAllOrders).Methods("GET")
	api.HandleFunc("/admin/orders/{id}/status", handlers.UpdateOrderStatus).Methods("PUT")
	api.HandleFunc("/admin/orders/{id}/cancel", handlers.CancelOrder).Methods("PUT")

	// Health check
	api.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "healthy"}`))
	}).Methods("GET")
}
