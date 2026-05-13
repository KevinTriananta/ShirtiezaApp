package models

import (
	"time"

	"gorm.io/gorm"
)

type Collection struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `json:"name" gorm:"uniqueIndex;not null"`
	Slug        string         `json:"slug" gorm:"uniqueIndex;not null"`
	Image       string         `json:"image"`
	Description string         `json:"description"`
	IsActive    bool           `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at" gorm:"index"`

	// Relations
	Products []Product `json:"products,omitempty" gorm:"many2many:collection_products;"`
}
