package services

import (
	"backend-shirtieza/config"
	"backend-shirtieza/models"
	"encoding/json"
	"strings"
)

type ProductPayload struct {
	Name          string   `json:"name"`
	Slug          string   `json:"slug"`
	Description   string   `json:"description"`
	Price         float64  `json:"price"`
	DiscountPrice *float64 `json:"discount_price"`
	Image         string   `json:"image"`
	Images        string   `json:"images"`
	Colors        string   `json:"colors"`
	Stock         int      `json:"stock"`
	Rating        float64  `json:"rating"`
	ReviewCount   int      `json:"review_count"`
	IsFeatured    bool     `json:"is_featured"`
	CategoryID    uint     `json:"category_id"`
	CollectionIDs []uint   `json:"collection_ids"`
}

type ProductDTO struct {
	ID            uint                   `json:"id"`
	Name          string                 `json:"name"`
	Slug          string                 `json:"slug"`
	Description   string                 `json:"description"`
	Price         float64                `json:"price"`
	DiscountPrice *float64               `json:"discount_price"`
	Image         string                 `json:"image"`
	Images        []string               `json:"images"`
	Colors        []string               `json:"colors"`
	Stock         int                    `json:"stock"`
	Rating        float64                `json:"rating"`
	ReviewCount   int                    `json:"review_count"`
	IsFeatured    bool                   `json:"is_featured"`
	CategoryID    uint                   `json:"category_id"`
	Category      *models.Category       `json:"category,omitempty"`
	Collections   []models.Collection    `json:"collections,omitempty"`
	Reviews       []models.ProductReview `json:"reviews,omitempty"`
	CreatedAt     any                    `json:"created_at"`
}

func CreateProduct(input ProductPayload) (ProductDTO, error) {
	product := input.toProduct()
	input.CollectionIDs = normalizeProductCollectionIDs(input.CollectionIDs, input.CategoryID)
	if err := config.DB.Create(&product).Error; err != nil {
		return ProductDTO{}, err
	}
	if err := replaceProductCollections(&product, input.CollectionIDs); err != nil {
		return ProductDTO{}, err
	}
	if err := config.DB.Preload("Category").Preload("Collections").First(&product, product.ID).Error; err != nil {
		return ProductDTO{}, err
	}
	return ToProductDTO(product), nil
}

func UpdateProduct(id string, input ProductPayload) (ProductDTO, error) {
	var product models.Product
	if err := config.DB.First(&product, id).Error; err != nil {
		return ProductDTO{}, err
	}
	updates := map[string]interface{}{
		"name":           input.Name,
		"slug":           input.Slug,
		"description":    input.Description,
		"price":          input.Price,
		"discount_price": input.DiscountPrice,
		"image":          input.Image,
		"images":         input.Images,
		"colors":         input.Colors,
		"stock":          input.Stock,
		"rating":         input.Rating,
		"review_count":   input.ReviewCount,
		"is_featured":    input.IsFeatured,
		"category_id":    input.CategoryID,
	}
	if err := config.DB.Model(&product).Updates(updates).Error; err != nil {
		return ProductDTO{}, err
	}
	input.CollectionIDs = normalizeProductCollectionIDs(input.CollectionIDs, input.CategoryID)
	if err := replaceProductCollections(&product, input.CollectionIDs); err != nil {
		return ProductDTO{}, err
	}
	if err := config.DB.Preload("Category").Preload("Collections").First(&product, id).Error; err != nil {
		return ProductDTO{}, err
	}
	return ToProductDTO(product), nil
}

func ToProductDTO(product models.Product) ProductDTO {
	return ProductDTO{ID: product.ID, Name: product.Name, Slug: product.Slug, Description: product.Description, Price: product.Price, DiscountPrice: product.DiscountPrice, Image: product.Image, Images: parseStringList(product.Images), Colors: parseStringList(product.Colors), Stock: product.Stock, Rating: product.Rating, ReviewCount: product.ReviewCount, IsFeatured: product.IsFeatured, CategoryID: product.CategoryID, Category: product.Category, Collections: product.Collections, Reviews: product.Reviews, CreatedAt: product.CreatedAt}
}

func ToProductDTOs(products []models.Product) []ProductDTO {
	productDTOs := make([]ProductDTO, 0, len(products))
	for _, product := range products {
		productDTOs = append(productDTOs, ToProductDTO(product))
	}
	return productDTOs
}

func (payload ProductPayload) toProduct() models.Product {
	return models.Product{Name: payload.Name, Slug: payload.Slug, Description: payload.Description, Price: payload.Price, DiscountPrice: payload.DiscountPrice, Image: payload.Image, Images: payload.Images, Colors: payload.Colors, Stock: payload.Stock, Rating: payload.Rating, ReviewCount: payload.ReviewCount, IsFeatured: payload.IsFeatured, CategoryID: payload.CategoryID}
}

func replaceProductCollections(product *models.Product, collectionIDs []uint) error {
	if len(collectionIDs) == 0 {
		return config.DB.Model(product).Association("Collections").Clear()
	}
	var collections []models.Collection
	if err := config.DB.Where("id IN ?", collectionIDs).Find(&collections).Error; err != nil {
		return err
	}
	return config.DB.Model(product).Association("Collections").Replace(collections)
}

func normalizeProductCollectionIDs(collectionIDs []uint, categoryID uint) []uint {
	seen := map[uint]bool{}
	normalized := make([]uint, 0, len(collectionIDs)+1)
	for _, id := range collectionIDs {
		if id == 0 || seen[id] {
			continue
		}
		seen[id] = true
		normalized = append(normalized, id)
	}
	var category models.Category
	if categoryID != 0 && config.DB.First(&category, categoryID).Error == nil && category.CollectionID != nil && !seen[*category.CollectionID] {
		normalized = append(normalized, *category.CollectionID)
	}
	return normalized
}

func parseStringList(value string) []string {
	if strings.TrimSpace(value) == "" {
		return []string{}
	}
	var values []string
	if err := json.Unmarshal([]byte(value), &values); err == nil {
		return values
	}
	parts := strings.Split(value, ",")
	values = make([]string, 0, len(parts))
	for _, part := range parts {
		if trimmed := strings.TrimSpace(part); trimmed != "" {
			values = append(values, trimmed)
		}
	}
	if len(values) == 0 {
		return []string{value}
	}
	return values
}
