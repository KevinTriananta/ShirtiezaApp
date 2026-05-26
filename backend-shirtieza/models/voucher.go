package models

import (
	"gorm.io/gorm"
	"time"
)

type Voucher struct {
	ID                 uint           `gorm:"primaryKey" json:"id"`
	Code               string         `json:"code" gorm:"uniqueIndex;not null"`
	Name               string         `json:"name" gorm:"not null"`
	Description        string         `json:"description" gorm:"type:text"`
	DiscountPercentage float64        `json:"discount_percentage" gorm:"not null"`
	MaxDiscount        float64        `json:"max_discount" gorm:"default:0"`
	MinPurchase        float64        `json:"min_purchase" gorm:"default:0"`
	CategoryID         *uint          `json:"category_id"`
	Category           *Category      `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	ExpiresAt          time.Time      `json:"expires_at" gorm:"not null"`
	IsActive           bool           `json:"is_active" gorm:"default:true"`
	CreatedAt          time.Time      `json:"created_at"`
	UpdatedAt          time.Time      `json:"updated_at"`
	DeletedAt          gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

type UserVoucher struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `json:"user_id" gorm:"not null;uniqueIndex:idx_user_voucher"`
	User      *User          `json:"user,omitempty" gorm:"foreignKey:UserID"`
	VoucherID uint           `json:"voucher_id" gorm:"not null;uniqueIndex:idx_user_voucher"`
	Voucher   *Voucher       `json:"voucher,omitempty" gorm:"foreignKey:VoucherID"`
	UsedAt    *time.Time     `json:"used_at"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}
