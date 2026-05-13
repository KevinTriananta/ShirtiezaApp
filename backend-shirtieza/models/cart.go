package models

import (
	"time"

	"gorm.io/gorm"
)

type Cart struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `json:"user_id" gorm:"uniqueIndex"`
	User      *User          `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Total     float64        `json:"total" gorm:"default:0"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`

	// Relations
	Items []CartItem `json:"items,omitempty" gorm:"foreignKey:CartID"`
}

type CartItem struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CartID    uint           `json:"cart_id" gorm:"not null"`
	Cart      *Cart          `json:"cart,omitempty" gorm:"foreignKey:CartID"`
	ProductID uint           `json:"product_id" gorm:"not null"`
	Product   *Product       `json:"product,omitempty" gorm:"foreignKey:ProductID"`
	Quantity  int            `json:"quantity" gorm:"not null"`
	Price     float64        `json:"price" gorm:"not null"` // Price at time of adding to cart
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

type CartResponse struct {
	ID    uint               `json:"id"`
	Items []CartItemResponse `json:"items"`
	Total float64            `json:"total"`
}

type CartItemResponse struct {
	ID       uint             `json:"id"`
	Product  *ProductResponse `json:"product"`
	Quantity int              `json:"quantity"`
	Price    float64          `json:"price"`
}
