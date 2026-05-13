package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"backend-shirtieza/config"
	"backend-shirtieza/models"
	"backend-shirtieza/utils"

	"github.com/gorilla/mux"
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

	utils.RespondWithSuccess(w, http.StatusOK, "Order fetched successfully", order)
}

// CreateOrder - Membuat order baru
func CreateOrder(w http.ResponseWriter, r *http.Request) {
	var orderData struct {
		UserID          uint    `json:"user_id"`
		ShippingAddress string  `json:"shipping_address"`
		ShippingCity    string  `json:"shipping_city"`
		ShippingCountry string  `json:"shipping_country"`
		ShippingZip     string  `json:"shipping_zip"`
		ShippingCost    float64 `json:"shipping_cost"`
		Tax             float64 `json:"tax"`
		PaymentMethod   string  `json:"payment_method"`
		Items           []struct {
			ProductID uint `json:"product_id"`
			Quantity  int  `json:"quantity"`
		} `json:"items"`
	}

	if err := json.NewDecoder(r.Body).Decode(&orderData); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}

	// Validate user exists
	var user models.User
	if err := config.DB.First(&user, orderData.UserID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "User not found", err.Error())
		return
	}

	// Calculate subtotal and create order items
	var subtotal float64 = 0
	var orderItems []models.OrderItem

	for _, item := range orderData.Items {
		var product models.Product
		if err := config.DB.First(&product, item.ProductID).Error; err != nil {
			utils.RespondWithError(w, http.StatusNotFound, fmt.Sprintf("Product %d not found", item.ProductID), err.Error())
			return
		}

		itemTotal := product.Price * float64(item.Quantity)
		subtotal += itemTotal

		orderItems = append(orderItems, models.OrderItem{
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			Price:     product.Price,
		})
	}

	// Create order
	order := models.Order{
		OrderNumber:     generateOrderNumber(),
		UserID:          orderData.UserID,
		ShippingAddress: orderData.ShippingAddress,
		ShippingCity:    orderData.ShippingCity,
		ShippingCountry: orderData.ShippingCountry,
		ShippingZip:     orderData.ShippingZip,
		Subtotal:        subtotal,
		ShippingCost:    orderData.ShippingCost,
		Tax:             orderData.Tax,
		Total:           subtotal + orderData.ShippingCost + orderData.Tax,
		Status:          "pending",
		PaymentStatus:   "unpaid",
		PaymentMethod:   orderData.PaymentMethod,
		Items:           orderItems,
	}

	if err := config.DB.Create(&order).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to create order", err.Error())
		return
	}

	// Clear user's cart
	var cart models.Cart
	if err := config.DB.Where("user_id = ?", orderData.UserID).First(&cart).Error; err == nil {
		config.DB.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{})
		cart.Total = 0
		config.DB.Save(&cart)
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
	var totalUsers int64
	var totalProducts int64

	// Get Total Revenue from completed/processing orders
	config.DB.Model(&models.Order{}).Where("status != ?", "cancelled").Select("SUM(total)").Scan(&totalRevenue)

	// Get Total Orders
	config.DB.Model(&models.Order{}).Count(&totalOrders)

	// Get Total Users
	config.DB.Model(&models.User{}).Count(&totalUsers)

	// Get Total Products
	config.DB.Model(&models.Product{}).Count(&totalProducts)

	stats := map[string]interface{}{
		"revenue":  totalRevenue,
		"orders":   totalOrders,
		"users":    totalUsers,
		"products": totalProducts,
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Admin stats fetched successfully", stats)
}

// Helper function to generate order number
func generateOrderNumber() string {
	return fmt.Sprintf("ORD-%d", time.Now().UnixNano())
}
