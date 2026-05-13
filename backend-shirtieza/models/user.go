package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `json:"name" gorm:"not null"`
	Email     string         `json:"email" gorm:"uniqueIndex;not null"`
	Password  string         `json:"-" gorm:"not null"`
	Phone     string         `json:"phone"`
	Address   string         `json:"address"`
	City      string         `json:"city"`
	Country   string         `json:"country"`
	ZipCode   string         `json:"zip_code"`
	Avatar    string         `json:"avatar"`
	Role      string         `json:"role" gorm:"default:'customer'"` // admin, customer
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`

	// Relations
	Orders  []Order         `json:"orders,omitempty" gorm:"foreignKey:UserID"`
	Cart    *Cart           `json:"cart,omitempty" gorm:"foreignKey:UserID"`
	Reviews []ProductReview `json:"reviews,omitempty" gorm:"foreignKey:UserID"`
}

type UserResponse struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Address string `json:"address"`
	City    string `json:"city"`
	Country string `json:"country"`
	Avatar  string `json:"avatar"`
	Role    string `json:"role"`
}
