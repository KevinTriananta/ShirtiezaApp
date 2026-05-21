package services

import (
	"backend-shirtieza/config"
	"backend-shirtieza/models"
	"fmt"
	"gorm.io/gorm"
	"time"
)

type CreateOrderInput struct {
	UserID          uint    `json:"user_id"`
	ShippingAddress string  `json:"shipping_address"`
	ShippingCity    string  `json:"shipping_city"`
	ShippingCountry string  `json:"shipping_country"`
	ShippingZip     string  `json:"shipping_zip"`
	ShippingCost    float64 `json:"shipping_cost"`
	Tax             float64 `json:"tax"`
	PaymentMethod   string  `json:"payment_method"`
	Items           []struct {
		ProductID uint `json:"product_id"`
		Quantity  int  `json:"quantity"`
	} `json:"items"`
}

func CreateOrder(input CreateOrderInput) (models.Order, error) {
	var order models.Order
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&models.User{}, input.UserID).Error; err != nil {
			return err
		}

		subtotal, orderItems, err := buildOrderItems(tx, input.Items)
		if err != nil {
			return err
		}

		order = models.Order{OrderNumber: generateOrderNumber(), UserID: input.UserID, ShippingAddress: input.ShippingAddress, ShippingCity: input.ShippingCity, ShippingCountry: input.ShippingCountry, ShippingZip: input.ShippingZip, Subtotal: subtotal, ShippingCost: input.ShippingCost, Tax: input.Tax, Total: subtotal + input.ShippingCost + input.Tax, Status: "pending", PaymentStatus: "unpaid", PaymentMethod: input.PaymentMethod, Items: orderItems}
		if err := tx.Create(&order).Error; err != nil {
			return err
		}
		for _, item := range input.Items {
			if err := tx.Model(&models.Product{}).Where("id = ? AND stock >= ?", item.ProductID, item.Quantity).Update("stock", gorm.Expr("stock - ?", item.Quantity)).Error; err != nil {
				return err
			}
		}
		return clearUserCart(tx, input.UserID)
	})
	return order, err
}

func buildOrderItems(tx *gorm.DB, items []struct {
	ProductID uint `json:"product_id"`
	Quantity  int  `json:"quantity"`
}) (float64, []models.OrderItem, error) {
	var subtotal float64
	orderItems := make([]models.OrderItem, 0, len(items))
	for _, item := range items {
		if item.Quantity < 1 {
			return 0, nil, fmt.Errorf("quantity must be at least 1")
		}
		var product models.Product
		if err := tx.First(&product, item.ProductID).Error; err != nil {
			return 0, nil, fmt.Errorf("product %d not found: %w", item.ProductID, err)
		}
		if product.Stock < item.Quantity {
			return 0, nil, fmt.Errorf("insufficient stock for %s", product.Name)
		}
		itemTotal := product.Price * float64(item.Quantity)
		subtotal += itemTotal
		orderItems = append(orderItems, models.OrderItem{ProductID: item.ProductID, Quantity: item.Quantity, Price: product.Price})
	}
	return subtotal, orderItems, nil
}

func clearUserCart(tx *gorm.DB, userID uint) error {
	var cart models.Cart
	if err := tx.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		return nil
	}
	if err := tx.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		return err
	}
	cart.Total = 0
	return tx.Save(&cart).Error
}

func generateOrderNumber() string {
	return fmt.Sprintf("ORD-%d", time.Now().UnixNano())
}
