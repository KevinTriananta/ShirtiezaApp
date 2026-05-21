package handlers

import (
	"backend-shirtieza/config"
	"backend-shirtieza/middleware"
	"backend-shirtieza/models"
	"backend-shirtieza/utils"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)

// GetUserCart - Mendapatkan keranjang belanja user
func GetUserCart(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["user_id"]
	if !canAccessCart(r, userID) {
		utils.RespondWithError(w, http.StatusForbidden, "Forbidden", "You can only access your own cart")
		return
	}
	var cart models.Cart
	if err := config.DB.
		Where("user_id = ?", userID).
		Preload("Items").
		Preload("Items.Product").
		First(&cart).Error; err != nil {
		var userIDUint uint
		fmt.Sscan(userID, &userIDUint)
		cart = models.Cart{UserID: userIDUint, Items: []models.CartItem{}}
		if err := config.DB.Create(&cart).Error; err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Failed to create cart", err.Error())
			return
		}
		utils.RespondWithSuccess(w, http.StatusOK, "Cart is empty", cart)
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Cart fetched successfully", cart)
}

// AddToCart - Menambah item ke keranjang
func AddToCart(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["user_id"]
	if !canAccessCart(r, userID) {
		utils.RespondWithError(w, http.StatusForbidden, "Forbidden", "You can only update your own cart")
		return
	}
	var cartItemData struct {
		ProductID uint `json:"product_id"`
		Quantity  int  `json:"quantity"`
	}
	if err := json.NewDecoder(r.Body).Decode(&cartItemData); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}
	// Get or create cart
	var cart models.Cart
	if err := config.DB.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		// Create new cart
		var userIDUint uint
		fmt.Sscan(userID, &userIDUint)
		cart.UserID = userIDUint
		if err := config.DB.Create(&cart).Error; err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Failed to create cart", err.Error())
			return
		}
	}
	// Check if product exists
	var product models.Product
	if err := config.DB.First(&product, cartItemData.ProductID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Product not found", err.Error())
		return
	}
	if cartItemData.Quantity < 1 {
		utils.RespondWithError(w, http.StatusBadRequest, "Quantity must be at least 1", nil)
		return
	}
	if product.Stock < cartItemData.Quantity {
		utils.RespondWithError(w, http.StatusBadRequest, "Insufficient stock", nil)
		return
	}
	// Check if item already in cart
	var existingItem models.CartItem
	if err := config.DB.
		Where("cart_id = ? AND product_id = ?", cart.ID, cartItemData.ProductID).
		First(&existingItem).Error; err == nil {
		// Update quantity
		existingItem.Quantity += cartItemData.Quantity
		if err := config.DB.Save(&existingItem).Error; err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Failed to update cart item", err.Error())
			return
		}
	} else {
		// Add new item
		cartItem := models.CartItem{
			CartID:    cart.ID,
			ProductID: cartItemData.ProductID,
			Quantity:  cartItemData.Quantity,
			Price:     product.Price,
		}
		if err := config.DB.Create(&cartItem).Error; err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Failed to add item to cart", err.Error())
			return
		}
	}
	// Recalculate cart total
	calculateCartTotal(cart.ID)
	// Fetch updated cart
	if err := config.DB.
		Where("user_id = ?", userID).
		Preload("Items").
		Preload("Items.Product").
		First(&cart).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch cart", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Item added to cart successfully", cart)
}

// UpdateCartItem - Update item di keranjang
func UpdateCartItem(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	itemID := vars["item_id"]
	var updateData struct {
		Quantity int `json:"quantity"`
	}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}
	if updateData.Quantity < 1 {
		utils.RespondWithError(w, http.StatusBadRequest, "Quantity must be at least 1", nil)
		return
	}
	var cartItem models.CartItem
	if err := config.DB.Preload("Cart").First(&cartItem, itemID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Cart item not found", err.Error())
		return
	}
	if !canAccessCart(r, fmt.Sprintf("%d", cartItem.Cart.UserID)) {
		utils.RespondWithError(w, http.StatusForbidden, "Forbidden", "You can only update your own cart")
		return
	}
	cartItem.Quantity = updateData.Quantity
	if err := config.DB.Save(&cartItem).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to update cart item", err.Error())
		return
	}
	// Recalculate cart total
	calculateCartTotal(cartItem.CartID)
	cart, err := fetchCartByID(cartItem.CartID)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch cart", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Cart item updated successfully", cart)
}

// RemoveFromCart - Menghapus item dari keranjang
func RemoveFromCart(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	itemID := vars["item_id"]
	var cartItem models.CartItem
	if err := config.DB.Preload("Cart").First(&cartItem, itemID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Cart item not found", err.Error())
		return
	}
	if !canAccessCart(r, fmt.Sprintf("%d", cartItem.Cart.UserID)) {
		utils.RespondWithError(w, http.StatusForbidden, "Forbidden", "You can only update your own cart")
		return
	}
	cartID := cartItem.CartID
	if err := config.DB.Delete(&cartItem).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to remove item", err.Error())
		return
	}
	// Recalculate cart total
	calculateCartTotal(cartID)
	cart, err := fetchCartByID(cartID)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch cart", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Item removed from cart successfully", cart)
}

// ClearCart - Mengosongkan keranjang
func ClearCart(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["user_id"]
	if !canAccessCart(r, userID) {
		utils.RespondWithError(w, http.StatusForbidden, "Forbidden", "You can only update your own cart")
		return
	}
	var cart models.Cart
	if err := config.DB.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Cart not found", err.Error())
		return
	}
	if err := config.DB.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to clear cart", err.Error())
		return
	}
	cart.Total = 0
	config.DB.Save(&cart)
	cart.Items = []models.CartItem{}
	utils.RespondWithSuccess(w, http.StatusOK, "Cart cleared successfully", cart)
}

// Helper function to calculate cart total
func calculateCartTotal(cartID uint) {
	var cartItems []models.CartItem
	var total float64 = 0
	config.DB.Where("cart_id = ?", cartID).Find(&cartItems)
	for _, item := range cartItems {
		total += item.Price * float64(item.Quantity)
	}
	config.DB.Model(&models.Cart{}).Where("id = ?", cartID).Update("total", total)
}
func fetchCartByID(cartID uint) (models.Cart, error) {
	var cart models.Cart
	err := config.DB.Preload("Items").Preload("Items.Product").First(&cart, cartID).Error
	return cart, err
}
func canAccessCart(r *http.Request, requestedID string) bool {
	if middleware.CurrentUserRole(r) == "admin" {
		return true
	}
	currentUserID, ok := middleware.CurrentUserID(r)
	return ok && requestedID == fmt.Sprintf("%d", currentUserID)
}
