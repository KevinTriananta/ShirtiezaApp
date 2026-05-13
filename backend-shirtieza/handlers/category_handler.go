package handlers

import (
	"encoding/json"
	"net/http"

	"backend-shirtieza/config"
	"backend-shirtieza/models"
	"backend-shirtieza/utils"

	"github.com/gorilla/mux"
)

// GetAllCategories - Mendapatkan semua kategori
func GetAllCategories(w http.ResponseWriter, r *http.Request) {
	var categories []models.Category

	if err := config.DB.Find(&categories).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch categories", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Categories fetched successfully", categories)
}

// GetCategoryByID - Mendapatkan detail kategori
func GetCategoryByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var category models.Category
	if err := config.DB.
		Preload("Products").
		First(&category, id).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Category not found", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Category fetched successfully", category)
}

// GetCategoryBySlug - Mendapatkan kategori berdasarkan slug
func GetCategoryBySlug(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]

	var category models.Category
	if err := config.DB.
		Where("slug = ?", slug).
		Preload("Products").
		First(&category).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Category not found", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Category fetched successfully", category)
}

// CreateCategory - Membuat kategori baru (Admin only)
func CreateCategory(w http.ResponseWriter, r *http.Request) {
	var category models.Category

	if err := json.NewDecoder(r.Body).Decode(&category); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}

	if err := config.DB.Create(&category).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to create category", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusCreated, "Category created successfully", category)
}

// UpdateCategory - Update kategori (Admin only)
func UpdateCategory(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var category models.Category
	var updateData models.Category

	if err := config.DB.First(&category, id).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Category not found", err.Error())
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}

	if err := config.DB.Model(&category).Updates(updateData).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to update category", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Category updated successfully", category)
}

// DeleteCategory - Menghapus kategori (Admin only)
func DeleteCategory(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if err := config.DB.Delete(&models.Category{}, id).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to delete category", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Category deleted successfully", nil)
}

// GetCategoryStats - Mendapatkan statistik kategori
func GetCategoryStats(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var category models.Category
	var productCount int64

	if err := config.DB.First(&category, id).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Category not found", err.Error())
		return
	}

	config.DB.Model(&models.Product{}).Where("category_id = ?", id).Count(&productCount)

	stats := map[string]interface{}{
		"category":      category,
		"product_count": productCount,
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Category stats fetched successfully", stats)
}
