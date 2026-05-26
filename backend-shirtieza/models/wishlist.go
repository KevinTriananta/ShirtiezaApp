package models

import (
	"gorm.io/gorm"
	"time"
)

type WishlistItem struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `json:"user_id" gorm:"not null;uniqueIndex:idx_user_product_wishlist"`
	User      *User          `json:"user,omitempty" gorm:"foreignKey:UserID"`
	ProductID uint           `json:"product_id" gorm:"not null;uniqueIndex:idx_user_product_wishlist"`
	Product   *Product       `json:"product,omitempty" gorm:"foreignKey:ProductID"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}
