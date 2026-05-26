package handlers

import (
	"backend-shirtieza/config"
	"backend-shirtieza/middleware"
	"backend-shirtieza/models"
	"backend-shirtieza/utils"
	"encoding/json"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

func GetWishlist(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.CurrentUserID(r)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}
	var items []models.WishlistItem
	if err := config.DB.Preload("Product").Preload("Product.Category").Where("user_id = ?", userID).Order("created_at DESC").Find(&items).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch wishlist", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Wishlist fetched successfully", items)
}

func AddWishlistItem(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.CurrentUserID(r)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}
	var payload struct {
		ProductID uint `json:"product_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}
	if payload.ProductID == 0 {
		utils.RespondWithError(w, http.StatusBadRequest, "Product is required", nil)
		return
	}
	var product models.Product
	if err := config.DB.First(&product, payload.ProductID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Product not found", err.Error())
		return
	}

	var item models.WishlistItem
	err := config.DB.Unscoped().Where("user_id = ? AND product_id = ?", userID, payload.ProductID).First(&item).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to add wishlist item", err.Error())
		return
	}
	if err == gorm.ErrRecordNotFound {
		item = models.WishlistItem{UserID: userID, ProductID: payload.ProductID}
		if err := config.DB.Create(&item).Error; err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Failed to add wishlist item", err.Error())
			return
		}
	} else if item.DeletedAt.Valid {
		if err := config.DB.Unscoped().Model(&item).Update("deleted_at", nil).Error; err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Failed to restore wishlist item", err.Error())
			return
		}
	}
	config.DB.Preload("Product").Preload("Product.Category").First(&item, item.ID)
	utils.RespondWithSuccess(w, http.StatusCreated, "Wishlist item added successfully", item)
}

func RemoveWishlistItem(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.CurrentUserID(r)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}
	if err := config.DB.Where("user_id = ? AND product_id = ?", userID, mux.Vars(r)["product_id"]).Delete(&models.WishlistItem{}).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to remove wishlist item", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Wishlist item removed successfully", nil)
}
