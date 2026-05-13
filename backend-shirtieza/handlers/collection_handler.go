package handlers

import (
	"encoding/json"
	"net/http"

	"backend-shirtieza/config"
	"backend-shirtieza/models"
	"backend-shirtieza/utils"

	"github.com/gorilla/mux"
)

// GetAllCollections - Mendapatkan semua koleksi
func GetAllCollections(w http.ResponseWriter, r *http.Request) {
	var collections []models.Collection

	if err := config.DB.Find(&collections).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch collections", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Collections fetched successfully", collections)
}

// GetCollectionByID - Mendapatkan detail koleksi
func GetCollectionByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var collection models.Collection
	if err := config.DB.
		Preload("Products").
		First(&collection, id).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Collection not found", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Collection fetched successfully", collection)
}

// GetCollectionBySlug - Mendapatkan koleksi berdasarkan slug
func GetCollectionBySlug(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]

	var collection models.Collection
	if err := config.DB.
		Where("slug = ?", slug).
		Preload("Products").
		First(&collection).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Collection not found", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Collection fetched successfully", collection)
}

// CreateCollection - Membuat koleksi baru (Admin only)
func CreateCollection(w http.ResponseWriter, r *http.Request) {
	var collection models.Collection

	if err := json.NewDecoder(r.Body).Decode(&collection); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}

	if err := config.DB.Create(&collection).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to create collection", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusCreated, "Collection created successfully", collection)
}

// UpdateCollection - Update koleksi (Admin only)
func UpdateCollection(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var collection models.Collection
	var updateData models.Collection

	if err := config.DB.First(&collection, id).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Collection not found", err.Error())
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}

	if err := config.DB.Model(&collection).Updates(updateData).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to update collection", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Collection updated successfully", collection)
}

// DeleteCollection - Menghapus koleksi (Admin only)
func DeleteCollection(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if err := config.DB.Delete(&models.Collection{}, id).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to delete collection", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Collection deleted successfully", nil)
}

// AddProductToCollection - Menambahkan produk ke koleksi
func AddProductToCollection(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	collectionID := vars["collection_id"]
	productID := vars["product_id"]

	var collection models.Collection
	if err := config.DB.First(&collection, collectionID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Collection not found", err.Error())
		return
	}

	var product models.Product
	if err := config.DB.First(&product, productID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Product not found", err.Error())
		return
	}

	if err := config.DB.Model(&collection).Association("Products").Append(&product); err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to add product to collection", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Product added to collection successfully", nil)
}

// RemoveProductFromCollection - Menghapus produk dari koleksi
func RemoveProductFromCollection(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	collectionID := vars["collection_id"]
	productID := vars["product_id"]

	var collection models.Collection
	if err := config.DB.First(&collection, collectionID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Collection not found", err.Error())
		return
	}

	if err := config.DB.Model(&collection).Association("Products").Delete(productID); err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to remove product from collection", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Product removed from collection successfully", nil)
}
