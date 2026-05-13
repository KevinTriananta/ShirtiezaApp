package models

import (
	"time"

	"gorm.io/gorm"
)

type Product struct {
	ID            uint     `gorm:"primaryKey" json:"id"`
	Name          string   `json:"name" gorm:"not null"`
	Slug          string   `json:"slug" gorm:"uniqueIndex"`
	Description   string   `json:"description" gorm:"type:text"`
	Price         float64  `json:"price" gorm:"not null"`
	DiscountPrice *float64 `json:"discount_price"`
	Image         string   `json:"image"`
	Images        string   `json:"images" gorm:"type:text"` // JSON string of images array
	Stock         int      `json:"stock" gorm:"default:0"`
	Rating        float64  `json:"rating" gorm:"default:0"`
	ReviewCount   int      `json:"review_count" gorm:"default:0"`
	IsFeatured    bool     `json:"is_featured" gorm:"default:false"`

	// Foreign Keys
	CategoryID uint      `json:"category_id"`
	Category   *Category `json:"category,omitempty" gorm:"foreignKey:CategoryID"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`

	// Relations
	Collections []Collection    `json:"collections,omitempty" gorm:"many2many:collection_products;"`
	Reviews     []ProductReview `json:"reviews,omitempty" gorm:"foreignKey:ProductID"`
	CartItems   []CartItem      `json:"cart_items,omitempty" gorm:"foreignKey:ProductID"`
	OrderItems  []OrderItem     `json:"order_items,omitempty" gorm:"foreignKey:ProductID"`
}

type ProductResponse struct {
	ID            uint         `json:"id"`
	Name          string       `json:"name"`
	Slug          string       `json:"slug"`
	Description   string       `json:"description"`
	Price         float64      `json:"price"`
	DiscountPrice *float64     `json:"discount_price"`
	Image         string       `json:"image"`
	Stock         int          `json:"stock"`
	Rating        float64      `json:"rating"`
	ReviewCount   int          `json:"review_count"`
	IsFeatured    bool         `json:"is_featured"`
	Category      *Category    `json:"category,omitempty"`
	Collections   []Collection `json:"collections,omitempty"`
	CreatedAt     time.Time    `json:"created_at"`
}
