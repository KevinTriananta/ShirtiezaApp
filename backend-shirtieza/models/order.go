package models

import (
	"time"

	"gorm.io/gorm"
)

type Order struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	OrderNumber string `json:"order_number" gorm:"uniqueIndex"`
	UserID      uint   `json:"user_id" gorm:"not null"`
	User        *User  `json:"user,omitempty" gorm:"foreignKey:UserID"`

	// Address Info
	ShippingAddress string `json:"shipping_address" gorm:"not null"`
	ShippingCity    string `json:"shipping_city" gorm:"not null"`
	ShippingCountry string `json:"shipping_country" gorm:"not null"`
	ShippingZip     string `json:"shipping_zip" gorm:"not null"`

	// Order Info
	Subtotal     float64 `json:"subtotal" gorm:"not null"`
	ShippingCost float64 `json:"shipping_cost" gorm:"default:0"`
	Tax          float64 `json:"tax" gorm:"default:0"`
	Total        float64 `json:"total" gorm:"not null"`

	// Status: pending, processing, shipped, delivered, cancelled
	Status        string `json:"status" gorm:"default:'pending'"`
	PaymentStatus string `json:"payment_status" gorm:"default:'unpaid'"` // paid, unpaid, refunded
	PaymentMethod string `json:"payment_method"`
	Notes         string `json:"notes" gorm:"type:text"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`

	// Relations
	Items []OrderItem `json:"items,omitempty" gorm:"foreignKey:OrderID"`
}

type OrderItem struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	OrderID   uint           `json:"order_id" gorm:"not null"`
	Order     *Order         `json:"order,omitempty" gorm:"foreignKey:OrderID"`
	ProductID uint           `json:"product_id" gorm:"not null"`
	Product   *Product       `json:"product,omitempty" gorm:"foreignKey:ProductID"`
	Quantity  int            `json:"quantity" gorm:"not null"`
	Price     float64        `json:"price" gorm:"not null"` // Price at time of purchase
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

type OrderResponse struct {
	ID            uint                `json:"id"`
	OrderNumber   string              `json:"order_number"`
	Status        string              `json:"status"`
	PaymentStatus string              `json:"payment_status"`
	Subtotal      float64             `json:"subtotal"`
	ShippingCost  float64             `json:"shipping_cost"`
	Tax           float64             `json:"tax"`
	Total         float64             `json:"total"`
	Items         []OrderItemResponse `json:"items"`
	CreatedAt     time.Time           `json:"created_at"`
}

type OrderItemResponse struct {
	Product  *ProductResponse `json:"product"`
	Quantity int              `json:"quantity"`
	Price    float64          `json:"price"`
}
