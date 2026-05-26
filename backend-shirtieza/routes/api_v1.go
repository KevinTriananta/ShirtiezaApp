package routes

import (
	"backend-shirtieza/handlers"
	"backend-shirtieza/middleware"
	"github.com/gorilla/mux"
	"net/http"
)

func SetupV1Routes(router *mux.Router) {
	// Public API v1 routes
	api := router.PathPrefix("/api/v1").Subrouter()
	// Admin Subrouter with Middleware
	admin := api.PathPrefix("/admin").Subrouter()
	admin.Use(middleware.AuthMiddleware)
	admin.Use(middleware.AdminMiddleware)
	protected := api.PathPrefix("").Subrouter()
	protected.Use(middleware.AuthMiddleware)
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
	// ============ WILAYAH INDONESIA ============
	api.HandleFunc("/wilayah/provinces", handlers.GetProvinces).Methods("GET")
	api.HandleFunc("/wilayah/cities", handlers.GetCities).Methods("GET")
	api.HandleFunc("/wilayah/districts", handlers.GetDistricts).Methods("GET")
	api.HandleFunc("/wilayah/villages", handlers.GetVillages).Methods("GET")
	// Admin routes for collections
	admin.HandleFunc("/collections", handlers.CreateCollection).Methods("POST")
	admin.HandleFunc("/collections/{id}", handlers.UpdateCollection).Methods("PUT")
	admin.HandleFunc("/collections/{id}", handlers.DeleteCollection).Methods("DELETE")
	admin.HandleFunc("/collections/{collection_id}/products/{product_id}", handlers.AddProductToCollection).Methods("POST")
	admin.HandleFunc("/collections/{collection_id}/products/{product_id}", handlers.RemoveProductFromCollection).Methods("DELETE")
	// ============ USERS ============
	api.HandleFunc("/auth/register", handlers.RegisterUser).Methods("POST")
	api.HandleFunc("/auth/login", handlers.LoginUser).Methods("POST")
	protected.HandleFunc("/users/{id}", handlers.GetUserProfile).Methods("GET")
	protected.HandleFunc("/users/{id}", handlers.UpdateUserProfile).Methods("PUT")
	protected.HandleFunc("/users/{id}/orders", handlers.GetUserOrders).Methods("GET")
	// Admin routes for users
	admin.HandleFunc("/users", handlers.GetAllUsers).Methods("GET")
	admin.HandleFunc("/users/{id}", handlers.AdminUpdateUser).Methods("PUT")
	admin.HandleFunc("/stats", handlers.GetAdminStats).Methods("GET")
	// ============ CART ============
	protected.HandleFunc("/cart/{user_id}", handlers.GetUserCart).Methods("GET")
	protected.HandleFunc("/cart/{user_id}/add", handlers.AddToCart).Methods("POST")
	protected.HandleFunc("/cart/item/{item_id}", handlers.UpdateCartItem).Methods("PUT")
	protected.HandleFunc("/cart/item/{item_id}", handlers.RemoveFromCart).Methods("DELETE")
	protected.HandleFunc("/cart/{user_id}/clear", handlers.ClearCart).Methods("DELETE")
	// ============ WISHLIST ============
	protected.HandleFunc("/wishlist", handlers.GetWishlist).Methods("GET")
	protected.HandleFunc("/wishlist", handlers.AddWishlistItem).Methods("POST")
	protected.HandleFunc("/wishlist/{product_id}", handlers.RemoveWishlistItem).Methods("DELETE")
	// ============ VOUCHERS ============
	api.HandleFunc("/vouchers", handlers.GetActiveVouchers).Methods("GET")
	protected.HandleFunc("/vouchers/me", handlers.GetUserVouchers).Methods("GET")
	protected.HandleFunc("/vouchers/{id}/claim", handlers.ClaimVoucher).Methods("POST")
	admin.HandleFunc("/vouchers", handlers.AdminGetVouchers).Methods("GET")
	admin.HandleFunc("/vouchers", handlers.AdminCreateVoucher).Methods("POST")
	admin.HandleFunc("/vouchers/{id}", handlers.AdminUpdateVoucher).Methods("PUT")
	admin.HandleFunc("/vouchers/{id}", handlers.AdminDeleteVoucher).Methods("DELETE")
	// ============ ORDERS ============
	protected.HandleFunc("/orders", handlers.CreateOrder).Methods("POST")
	protected.HandleFunc("/orders/{id}", handlers.GetOrderByID).Methods("GET")
	protected.HandleFunc("/orders/{id}/payment-proof", handlers.UploadPaymentProof).Methods("POST")
	// Admin routes for orders
	admin.HandleFunc("/orders", handlers.GetAllOrders).Methods("GET")
	admin.HandleFunc("/orders/{id}/status", handlers.UpdateOrderStatus).Methods("PUT")
	admin.HandleFunc("/orders/{id}/cancel", handlers.CancelOrder).Methods("PUT")
	// Health check
	api.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "healthy"}`))
	}).Methods("GET")
}
