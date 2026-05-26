package services

import (
	"backend-shirtieza/config"
	"backend-shirtieza/models"
	"fmt"
	"gorm.io/gorm"
	"math"
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
	UserVoucherID   *uint   `json:"user_voucher_id"`
	CartItemIDs     []uint  `json:"cart_item_ids"`
	Items           []struct {
		ProductID uint   `json:"product_id"`
		Quantity  int    `json:"quantity"`
		Size      string `json:"size"`
		Color     string `json:"color"`
	} `json:"items"`
}

type orderInputItem struct {
	ProductID  uint
	Quantity   int
	Size       string
	Color      string
	CartItemID uint
}

func CreateOrder(input CreateOrderInput) (models.Order, error) {
	var order models.Order
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&models.User{}, input.UserID).Error; err != nil {
			return err
		}

		items, err := resolveOrderInputItems(tx, input)
		if err != nil {
			return err
		}

		subtotal, orderItems, categoryTotals, err := buildOrderItems(tx, items)
		if err != nil {
			return err
		}

		discount, voucherID, err := applyVoucher(tx, input.UserID, input.UserVoucherID, subtotal, categoryTotals)
		if err != nil {
			return err
		}

		order = models.Order{OrderNumber: generateOrderNumber(), UserID: input.UserID, ShippingAddress: input.ShippingAddress, ShippingCity: input.ShippingCity, ShippingCountry: input.ShippingCountry, ShippingZip: input.ShippingZip, Subtotal: subtotal, Discount: discount, VoucherID: voucherID, ShippingCost: input.ShippingCost, Tax: input.Tax, Total: math.Max(0, subtotal-discount) + input.ShippingCost + input.Tax, Status: "pending", PaymentStatus: "unpaid", PaymentMethod: input.PaymentMethod, Items: orderItems}
		if err := tx.Create(&order).Error; err != nil {
			return err
		}
		for _, item := range items {
			if err := tx.Model(&models.Product{}).Where("id = ? AND stock >= ?", item.ProductID, item.Quantity).Update("stock", gorm.Expr("stock - ?", item.Quantity)).Error; err != nil {
				return err
			}
		}
		return clearPurchasedCartItems(tx, input.UserID, items)
	})
	return order, err
}

func resolveOrderInputItems(tx *gorm.DB, input CreateOrderInput) ([]orderInputItem, error) {
	if len(input.CartItemIDs) == 0 {
		items := make([]orderInputItem, 0, len(input.Items))
		for _, item := range input.Items {
			items = append(items, orderInputItem{ProductID: item.ProductID, Quantity: item.Quantity, Size: item.Size, Color: item.Color})
		}
		return items, nil
	}
	var cart models.Cart
	if err := tx.Where("user_id = ?", input.UserID).First(&cart).Error; err != nil {
		return nil, err
	}
	var cartItems []models.CartItem
	if err := tx.Where("cart_id = ? AND id IN ?", cart.ID, input.CartItemIDs).Find(&cartItems).Error; err != nil {
		return nil, err
	}
	if len(cartItems) != len(input.CartItemIDs) {
		return nil, fmt.Errorf("one or more cart items were not found")
	}
	items := make([]orderInputItem, 0, len(cartItems))
	for _, item := range cartItems {
		items = append(items, orderInputItem{ProductID: item.ProductID, Quantity: item.Quantity, Size: item.Size, Color: item.Color, CartItemID: item.ID})
	}
	return items, nil
}

func buildOrderItems(tx *gorm.DB, items []orderInputItem) (float64, []models.OrderItem, map[uint]float64, error) {
	var subtotal float64
	categoryTotals := map[uint]float64{}
	orderItems := make([]models.OrderItem, 0, len(items))
	if len(items) == 0 {
		return 0, nil, nil, fmt.Errorf("order must include at least one item")
	}
	for _, item := range items {
		if item.Quantity < 1 {
			return 0, nil, nil, fmt.Errorf("quantity must be at least 1")
		}
		if item.Size == "" {
			return 0, nil, nil, fmt.Errorf("please select a size")
		}
		var product models.Product
		if err := tx.First(&product, item.ProductID).Error; err != nil {
			return 0, nil, nil, fmt.Errorf("product %d not found: %w", item.ProductID, err)
		}
		if product.Stock < item.Quantity {
			return 0, nil, nil, fmt.Errorf("insufficient stock for %s", product.Name)
		}
		if product.Colors != "" && item.Color == "" {
			return 0, nil, nil, fmt.Errorf("please select a color for %s", product.Name)
		}
		itemTotal := product.Price * float64(item.Quantity)
		subtotal += itemTotal
		categoryTotals[product.CategoryID] += itemTotal
		orderItems = append(orderItems, models.OrderItem{ProductID: item.ProductID, Size: item.Size, Color: item.Color, Quantity: item.Quantity, Price: product.Price})
	}
	return subtotal, orderItems, categoryTotals, nil
}

func applyVoucher(tx *gorm.DB, userID uint, userVoucherID *uint, subtotal float64, categoryTotals map[uint]float64) (float64, *uint, error) {
	if userVoucherID == nil {
		return 0, nil, nil
	}
	var userVoucher models.UserVoucher
	if err := tx.Preload("Voucher").Where("id = ? AND user_id = ?", *userVoucherID, userID).First(&userVoucher).Error; err != nil {
		return 0, nil, err
	}
	if userVoucher.UsedAt != nil {
		return 0, nil, fmt.Errorf("voucher has already been used")
	}
	if userVoucher.Voucher == nil || !userVoucher.Voucher.IsActive || time.Now().After(userVoucher.Voucher.ExpiresAt) {
		return 0, nil, fmt.Errorf("voucher is not active")
	}
	if subtotal < userVoucher.Voucher.MinPurchase {
		return 0, nil, fmt.Errorf("minimum purchase for voucher is %.0f", userVoucher.Voucher.MinPurchase)
	}
	eligibleSubtotal := subtotal
	if userVoucher.Voucher.CategoryID != nil {
		eligibleSubtotal = categoryTotals[*userVoucher.Voucher.CategoryID]
	}
	if eligibleSubtotal <= 0 {
		return 0, nil, fmt.Errorf("voucher is not eligible for selected products")
	}
	discount := eligibleSubtotal * (userVoucher.Voucher.DiscountPercentage / 100)
	if userVoucher.Voucher.MaxDiscount > 0 && discount > userVoucher.Voucher.MaxDiscount {
		discount = userVoucher.Voucher.MaxDiscount
	}
	now := time.Now()
	userVoucher.UsedAt = &now
	if err := tx.Save(&userVoucher).Error; err != nil {
		return 0, nil, err
	}
	return discount, &userVoucher.VoucherID, nil
}

func clearPurchasedCartItems(tx *gorm.DB, userID uint, items []orderInputItem) error {
	var cart models.Cart
	if err := tx.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		return nil
	}
	ids := make([]uint, 0, len(items))
	for _, item := range items {
		if item.CartItemID != 0 {
			ids = append(ids, item.CartItemID)
		}
	}
	query := tx.Where("cart_id = ?", cart.ID)
	if len(ids) > 0 {
		query = query.Where("id IN ?", ids)
	}
	if err := query.Delete(&models.CartItem{}).Error; err != nil {
		return err
	}
	var total float64
	tx.Model(&models.CartItem{}).Where("cart_id = ?", cart.ID).Select("COALESCE(SUM(price * quantity), 0)").Scan(&total)
	cart.Total = total
	return tx.Save(&cart).Error
}

func generateOrderNumber() string {
	return fmt.Sprintf("ORD-%d", time.Now().UnixNano())
}
