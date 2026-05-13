package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"backend-shirtieza/config"
	"backend-shirtieza/models"
	"backend-shirtieza/utils"

	"github.com/gorilla/mux"
)

// GetUserCart - Mendapatkan keranjang belanja user
func GetUserCart(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["user_id"]

	var cart models.Cart
	if err := config.DB.
		Where("user_id = ?", userID).
		Preload("Items").
		Preload("Items.Product").
		First(&cart).Error; err != nil {
		// Cart tidak ditemukan, buat cart baru
		cart.UserID = 0
		fmt.Sscan(userID, &cart.UserID)
		utils.RespondWithSuccess(w, http.StatusOK, "Cart is empty", cart)
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Cart fetched successfully", cart)
}

// AddToCart - Menambah item ke keranjang
func AddToCart(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["user_id"]

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

	var cartItem models.CartItem
	if err := config.DB.First(&cartItem, itemID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Cart item not found", err.Error())
		return
	}

	cartItem.Quantity = updateData.Quantity

	if err := config.DB.Save(&cartItem).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to update cart item", err.Error())
		return
	}

	// Recalculate cart total
	calculateCartTotal(cartItem.CartID)

	utils.RespondWithSuccess(w, http.StatusOK, "Cart item updated successfully", cartItem)
}

// RemoveFromCart - Menghapus item dari keranjang
func RemoveFromCart(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	itemID := vars["item_id"]

	var cartItem models.CartItem
	if err := config.DB.First(&cartItem, itemID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Cart item not found", err.Error())
		return
	}

	cartID := cartItem.CartID

	if err := config.DB.Delete(&cartItem).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to remove item", err.Error())
		return
	}

	// Recalculate cart total
	calculateCartTotal(cartID)

	utils.RespondWithSuccess(w, http.StatusOK, "Item removed from cart successfully", nil)
}

// ClearCart - Mengosongkan keranjang
func ClearCart(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["user_id"]

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

	utils.RespondWithSuccess(w, http.StatusOK, "Cart cleared successfully", nil)
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
