package handlers

import (
	"backend-shirtieza/config"
	"backend-shirtieza/middleware"
	"backend-shirtieza/models"
	"backend-shirtieza/services"
	"backend-shirtieza/utils"
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
)

// GetAllOrders - Mendapatkan semua orders (Admin)
func GetAllOrders(w http.ResponseWriter, r *http.Request) {
	var orders []models.Order
	if err := config.DB.
		Preload("User").
		Preload("Items").
		Preload("Items.Product").
		Order("created_at DESC").
		Find(&orders).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch orders", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Orders fetched successfully", orders)
}

// GetOrderByID - Mendapatkan detail order
func GetOrderByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	orderID := vars["id"]
	var order models.Order
	if err := config.DB.
		Preload("User").
		Preload("Items").
		Preload("Items.Product").
		First(&order, orderID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Order not found", err.Error())
		return
	}
	if middleware.CurrentUserRole(r) != "admin" {
		currentUserID, ok := middleware.CurrentUserID(r)
		if !ok || order.UserID != currentUserID {
			utils.RespondWithError(w, http.StatusForbidden, "Forbidden", "You can only access your own order")
			return
		}
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Order fetched successfully", order)
}

// CreateOrder - Membuat order baru
func CreateOrder(w http.ResponseWriter, r *http.Request) {
	var orderData services.CreateOrderInput
	if err := json.NewDecoder(r.Body).Decode(&orderData); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}
	currentUserID, ok := middleware.CurrentUserID(r)
	if !ok || (middleware.CurrentUserRole(r) != "admin" && orderData.UserID != currentUserID) {
		utils.RespondWithError(w, http.StatusForbidden, "Forbidden", "You can only create orders for your own account")
		return
	}
	order, err := services.CreateOrder(orderData)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to create order", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusCreated, "Order created successfully", order)
}

// UpdateOrderStatus - Update status order
func UpdateOrderStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	orderID := vars["id"]
	var updateData struct {
		Status        string `json:"status"`
		PaymentStatus string `json:"payment_status"`
		Notes         string `json:"notes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}
	var order models.Order
	if err := config.DB.First(&order, orderID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Order not found", err.Error())
		return
	}
	if updateData.Status != "" {
		order.Status = updateData.Status
	}
	if updateData.PaymentStatus != "" {
		order.PaymentStatus = updateData.PaymentStatus
	}
	if updateData.Notes != "" {
		order.Notes = updateData.Notes
	}
	if err := config.DB.Save(&order).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to update order", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Order updated successfully", order)
}

// CancelOrder - Membatalkan order
func CancelOrder(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	orderID := vars["id"]
	var order models.Order
	if err := config.DB.First(&order, orderID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Order not found", err.Error())
		return
	}
	order.Status = "cancelled"
	if err := config.DB.Save(&order).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to cancel order", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Order cancelled successfully", order)
}

// GetAdminStats - Mendapatkan statistik untuk dashboard admin
func GetAdminStats(w http.ResponseWriter, r *http.Request) {
	var totalRevenue float64
	var totalOrders int64
	var activeOrders int64
	var pendingOrders int64
	var shippedOrders int64
	var totalUsers int64
	var totalProducts int64
	var lowStockProducts int64
	var itemsSold int64
	config.DB.Model(&models.Order{}).
		Where("status != ?", "cancelled").
		Select("COALESCE(SUM(total), 0)").
		Scan(&totalRevenue)
	// Get Total Orders
	config.DB.Model(&models.Order{}).Count(&totalOrders)
	config.DB.Model(&models.Order{}).Where("status != ?", "cancelled").Count(&activeOrders)
	config.DB.Model(&models.Order{}).Where("status IN ?", []string{"pending", "processing"}).Count(&pendingOrders)
	config.DB.Model(&models.Order{}).Where("status = ?", "shipped").Count(&shippedOrders)
	// Get Total Users
	config.DB.Model(&models.User{}).Count(&totalUsers)
	// Get Total Products
	config.DB.Model(&models.Product{}).Count(&totalProducts)
	config.DB.Model(&models.Product{}).Where("stock > 0 AND stock < ?", 10).Count(&lowStockProducts)
	config.DB.Model(&models.OrderItem{}).
		Joins("JOIN orders ON orders.id = order_items.order_id").
		Where("orders.status != ?", "cancelled").
		Select("COALESCE(SUM(order_items.quantity), 0)").
		Scan(&itemsSold)
	stats := map[string]interface{}{
		"revenue":            totalRevenue,
		"orders":             totalOrders,
		"active_orders":      activeOrders,
		"pending_orders":     pendingOrders,
		"shipped_orders":     shippedOrders,
		"users":              totalUsers,
		"products":           totalProducts,
		"low_stock_products": lowStockProducts,
		"items_sold":         itemsSold,
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Admin stats fetched successfully", stats)
}
