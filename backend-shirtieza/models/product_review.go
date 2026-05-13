package models

import (
	"time"

	"gorm.io/gorm"
)

type ProductReview struct {
	ID      uint   `gorm:"primaryKey" json:"id"`
	Rating  int    `json:"rating" gorm:"not null"` // 1-5
	Comment string `json:"comment" gorm:"type:text"`
	Helpful int    `json:"helpful" gorm:"default:0"`

	// Foreign Keys
	ProductID uint     `json:"product_id" gorm:"not null"`
	Product   *Product `json:"product,omitempty" gorm:"foreignKey:ProductID"`
	UserID    uint     `json:"user_id" gorm:"not null"`
	User      *User    `json:"user,omitempty" gorm:"foreignKey:UserID"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}
