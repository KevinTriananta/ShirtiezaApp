package models

import (
	"time"

	"gorm.io/gorm"
)

type Category struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `json:"name" gorm:"uniqueIndex;not null"`
	Slug        string         `json:"slug" gorm:"uniqueIndex;not null"`
	Icon        string         `json:"icon"`
	Image       string         `json:"image"`
	Description string         `json:"description"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at" gorm:"index"`

	// Relations
	Products []Product `json:"products,omitempty" gorm:"foreignKey:CategoryID"`
}
