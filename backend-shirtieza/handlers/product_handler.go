package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"backend-shirtieza/config"
	"backend-shirtieza/models"
	"backend-shirtieza/utils"

	"github.com/gorilla/mux"
)

// GetAllProducts - Mendapatkan semua produk dengan pagination dan filter
func GetAllProducts(w http.ResponseWriter, r *http.Request) {
	var products []models.Product
	var total int64

	// Query parameters
	page := r.URL.Query().Get("page")
	pageSize := r.URL.Query().Get("page_size")
	category := r.URL.Query().Get("category")
	search := r.URL.Query().Get("search")
	sortBy := r.URL.Query().Get("sort_by")

	// Default values
	pageNum := 1
	pageSizeNum := 12

	if page != "" {
		if p, err := strconv.Atoi(page); err == nil && p > 0 {
			pageNum = p
		}
	}

	if pageSize != "" {
		if ps, err := strconv.Atoi(pageSize); err == nil && ps > 0 && ps <= 100 {
			pageSizeNum = ps
		}
	}

	query := config.DB

	// Filter by category
	if category != "" {
		query = query.Where("category_id = ?", category)
	}

	// Search by name or description
	if search != "" {
		query = query.Where("name LIKE ? OR description LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Sorting
	switch sortBy {
	case "price_asc":
		query = query.Order("price ASC")
	case "price_desc":
		query = query.Order("price DESC")
	case "newest":
		query = query.Order("created_at DESC")
	case "rating":
		query = query.Order("rating DESC")
	default:
		query = query.Order("created_at DESC")
	}

	// Count total
	query.Model(&models.Product{}).Count(&total)

	// Pagination
	offset := (pageNum - 1) * pageSizeNum
	if err := query.Preload("Category").
		Preload("Collections").
		Offset(offset).
		Limit(pageSizeNum).
		Find(&products).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch products", err.Error())
		return
	}

	response := map[string]interface{}{
		"data":        products,
		"total":       total,
		"page":        pageNum,
		"page_size":   pageSizeNum,
		"total_pages": (total + int64(pageSizeNum) - 1) / int64(pageSizeNum),
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Products fetched successfully", response)
}

// GetProductByID - Mendapatkan detail produk berdasarkan ID
func GetProductByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var product models.Product
	if err := config.DB.
		Preload("Category").
		Preload("Collections").
		Preload("Reviews").
		First(&product, id).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Product not found", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Product fetched successfully", product)
}

// GetProductBySlug - Mendapatkan produk berdasarkan slug
func GetProductBySlug(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]

	var product models.Product
	if err := config.DB.
		Where("slug = ?", slug).
		Preload("Category").
		Preload("Collections").
		Preload("Reviews").
		First(&product).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Product not found", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Product fetched successfully", product)
}

// CreateProduct - Membuat produk baru (Admin only)
func CreateProduct(w http.ResponseWriter, r *http.Request) {
	var product models.Product

	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}

	if err := config.DB.Create(&product).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to create product", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusCreated, "Product created successfully", product)
}

// UpdateProduct - Update produk (Admin only)
func UpdateProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var product models.Product
	var updateData models.Product

	if err := config.DB.First(&product, id).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Product not found", err.Error())
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}

	if err := config.DB.Model(&product).Updates(updateData).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to update product", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Product updated successfully", product)
}

// DeleteProduct - Menghapus produk (Admin only)
func DeleteProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if err := config.DB.Delete(&models.Product{}, id).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to delete product", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Product deleted successfully", nil)
}

// GetFeaturedProducts - Mendapatkan produk featured
func GetFeaturedProducts(w http.ResponseWriter, r *http.Request) {
	var products []models.Product

	if err := config.DB.
		Where("is_featured = ?", true).
		Preload("Category").
		Preload("Collections").
		Limit(8).
		Order("created_at DESC").
		Find(&products).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch featured products", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Featured products fetched successfully", products)
}

// GetProductsByCollection - Mendapatkan produk berdasarkan koleksi
func GetProductsByCollection(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	collectionID := vars["collection_id"]

	var collection models.Collection
	if err := config.DB.
		Preload("Products").
		First(&collection, collectionID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Collection not found", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Products fetched successfully", collection.Products)
}

// GetProductsByCategory - Mendapatkan produk berdasarkan kategori
func GetProductsByCategory(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	categoryID := vars["category_id"]

	var products []models.Product
	if err := config.DB.
		Where("category_id = ?", categoryID).
		Preload("Category").
		Find(&products).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch products", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Products fetched successfully", products)
}
