package handlers

import (
	"backend-shirtieza/config"
	"backend-shirtieza/models"
	"backend-shirtieza/services"
	"backend-shirtieza/utils"
	"encoding/json"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

func GetAllProducts(w http.ResponseWriter, r *http.Request) {
	var products []models.Product
	var total int64
	pageNum, pageSizeNum := parsePagination(r)
	query := config.DB

	if category := r.URL.Query().Get("category"); category != "" {
		query = query.Where("category_id = ?", category)
	}
	if search := r.URL.Query().Get("search"); search != "" {
		query = query.Where("name LIKE ? OR description LIKE ?", "%"+search+"%", "%"+search+"%")
	}
	query = applyProductSort(query, r.URL.Query().Get("sort_by"))
	query.Model(&models.Product{}).Count(&total)

	if err := query.Preload("Category").Preload("Collections").Offset((pageNum - 1) * pageSizeNum).Limit(pageSizeNum).Find(&products).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch products", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Products fetched successfully", map[string]interface{}{
		"data":        services.ToProductDTOs(products),
		"total":       total,
		"page":        pageNum,
		"page_size":   pageSizeNum,
		"total_pages": (total + int64(pageSizeNum) - 1) / int64(pageSizeNum),
	})
}

func GetProductByID(w http.ResponseWriter, r *http.Request) {
	var product models.Product
	if err := config.DB.Preload("Category").Preload("Collections").Preload("Reviews").First(&product, mux.Vars(r)["id"]).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Product not found", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Product fetched successfully", services.ToProductDTO(product))
}

func GetProductBySlug(w http.ResponseWriter, r *http.Request) {
	var product models.Product
	if err := config.DB.Where("slug = ?", mux.Vars(r)["slug"]).Preload("Category").Preload("Collections").Preload("Reviews").First(&product).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Product not found", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Product fetched successfully", services.ToProductDTO(product))
}

func CreateProduct(w http.ResponseWriter, r *http.Request) {
	var input services.ProductPayload
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}
	product, err := services.CreateProduct(input)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to create product", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusCreated, "Product created successfully", product)
}

func UpdateProduct(w http.ResponseWriter, r *http.Request) {
	var input services.ProductPayload
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}
	product, err := services.UpdateProduct(mux.Vars(r)["id"], input)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to update product", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Product updated successfully", product)
}

func DeleteProduct(w http.ResponseWriter, r *http.Request) {
	if err := config.DB.Delete(&models.Product{}, mux.Vars(r)["id"]).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to delete product", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Product deleted successfully", nil)
}

func GetFeaturedProducts(w http.ResponseWriter, r *http.Request) {
	var products []models.Product
	if err := config.DB.Where("is_featured = ?", true).Preload("Category").Preload("Collections").Limit(8).Order("created_at DESC").Find(&products).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch featured products", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Featured products fetched successfully", services.ToProductDTOs(products))
}

func GetProductsByCollection(w http.ResponseWriter, r *http.Request) {
	var collection models.Collection
	if err := config.DB.Preload("Products").First(&collection, mux.Vars(r)["collection_id"]).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Collection not found", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Products fetched successfully", services.ToProductDTOs(collection.Products))
}

func GetProductsByCategory(w http.ResponseWriter, r *http.Request) {
	var products []models.Product
	if err := config.DB.Where("category_id = ?", mux.Vars(r)["category_id"]).Preload("Category").Find(&products).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch products", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Products fetched successfully", services.ToProductDTOs(products))
}

func parsePagination(r *http.Request) (int, int) {
	pageNum := 1
	pageSizeNum := 12
	if page := r.URL.Query().Get("page"); page != "" {
		if p, err := strconv.Atoi(page); err == nil && p > 0 {
			pageNum = p
		}
	}
	if pageSize := r.URL.Query().Get("page_size"); pageSize != "" {
		if ps, err := strconv.Atoi(pageSize); err == nil && ps > 0 && ps <= 100 {
			pageSizeNum = ps
		}
	}
	return pageNum, pageSizeNum
}

func applyProductSort(query *gorm.DB, sortBy string) *gorm.DB {
	switch sortBy {
	case "price_asc":
		return query.Order("price ASC")
	case "price_desc":
		return query.Order("price DESC")
	case "rating":
		return query.Order("rating DESC")
	default:
		return query.Order("created_at DESC")
	}
}
