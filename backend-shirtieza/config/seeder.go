package config

import (
	"backend-shirtieza/models"
	"errors"
	"log"
	"os"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedDatabase() {
	// Seed categories
	categories := []models.Category{
		{
			Name:        "Hoodie",
			Slug:        "hoodie",
			Description: "Comfortable and warm hoodies for all seasons",
		},
		{
			Name:        "Caps & Bags",
			Slug:        "caps-bags",
			Description: "Stylish caps and bags for every occasion",
		},
		{
			Name:        "Trending",
			Slug:        "trending",
			Description: "Latest trending fashion items",
		},
		{
			Name:        "Out Wear",
			Slug:        "outwear",
			Description: "Jackets, coats, and outerwear",
		},
		{
			Name:        "Accessories",
			Slug:        "accessories",
			Description: "Fashion accessories and more",
		},
	}
	for _, category := range categories {
		if err := DB.FirstOrCreate(&category, models.Category{Slug: category.Slug}).Error; err != nil {
			log.Printf("Error seeding category %s: %v", category.Name, err)
		}
	}
	// Seed collections
	collections := []models.Collection{
		{
			Name:        "Women Collection",
			Slug:        "women-collection",
			Description: "Exclusive collection for women",
			IsActive:    true,
		},
		{
			Name:        "Men Collection",
			Slug:        "men-collection",
			Description: "Exclusive collection for men",
			IsActive:    true,
		},
		{
			Name:        "New Arrivals",
			Slug:        "new-arrivals",
			Description: "Latest products just arrived",
			IsActive:    true,
		},
		{
			Name:        "Summer Collection",
			Slug:        "summer-collection",
			Description: "Perfect for summer season",
			IsActive:    true,
		},
		{
			Name:        "Winter Collection",
			Slug:        "winter-collection",
			Description: "Warm and cozy winter items",
			IsActive:    true,
		},
	}
	for _, collection := range collections {
		if err := DB.FirstOrCreate(&collection, models.Collection{Slug: collection.Slug}).Error; err != nil {
			log.Printf("Error seeding collection %s: %v", collection.Name, err)
		}
	}
	seedCollectionCategories()
	cleanupLegacyProductSeedData()
	seedAdminUser()
	log.Println("✅ Database seeding completed successfully")
}

func seedAdminUser() {
	adminEmail := getenvDefault("ADMIN_EMAIL", "admin@shirtieza.com")
	adminName := getenvDefault("ADMIN_NAME", "Shirtieza Admin")
	adminPassword := os.Getenv("ADMIN_PASSWORD")
	if adminPassword == "" {
		if os.Getenv("SERVER_ENV") == "production" {
			log.Println("Admin seed skipped: set ADMIN_PASSWORD to create or update the admin user")
			return
		}
		adminPassword = "admin123"
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(adminPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing admin password: %v", err)
		return
	}

	var admin models.User
	err = DB.Where("email = ?", adminEmail).First(&admin).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		adminUser := models.User{
			Name:     adminName,
			Email:    adminEmail,
			Password: string(hashedPassword),
			Role:     "admin",
		}
		if err := DB.Create(&adminUser).Error; err == nil {
			log.Printf("👤 Admin user created (%s)", adminEmail)
		}
		return
	}
	if err != nil {
		log.Printf("Error checking admin user: %v", err)
		return
	} else {
		DB.Model(&admin).Updates(map[string]interface{}{
			"name":     adminName,
			"password": string(hashedPassword),
			"role":     "admin",
		})
	}
}

func getenvDefault(key string, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func cleanupLegacyProductSeedData() {
	legacyProductSlugs := []string{
		"signature-oversized-hoodie",
		"urban-street-cap",
		"cyberpunk-bomber-jacket",
		"minimalist-tote-bag",
		"essential-white-tee",
		"cargo-tech-pants",
		"silver-chain-link",
		"washed-denim-overshirt",
		"ribbed-everyday-socks",
		"diagnose-test-tee",
	}

	var products []models.Product
	if err := DB.Unscoped().Where("slug IN ? OR id = ?", legacyProductSlugs, 0).Find(&products).Error; err != nil {
		log.Printf("Error checking legacy product seed data: %v", err)
		return
	}
	for _, product := range products {
		deleteProductReferences(product.ID)
		if product.ID == 0 {
			DB.Exec("DELETE FROM products WHERE id = 0 OR slug = ?", product.Slug)
			continue
		}
		if err := DB.Unscoped().Delete(&product).Error; err != nil {
			log.Printf("Error deleting legacy product %s: %v", product.Slug, err)
		}
	}
}

func deleteProductReferences(productID uint) {
	DB.Unscoped().Where("product_id = ?", productID).Delete(&models.CartItem{})
	DB.Unscoped().Where("product_id = ?", productID).Delete(&models.OrderItem{})
	DB.Unscoped().Where("product_id = ?", productID).Delete(&models.ProductReview{})
	DB.Unscoped().Where("product_id = ?", productID).Delete(&models.WishlistItem{})
	DB.Exec("DELETE FROM collection_products WHERE product_id = ?", productID)
}

func seedCollectionCategories() {
	var womenCollection models.Collection
	var menCollection models.Collection
	DB.Where("slug = ?", "women-collection").First(&womenCollection)
	DB.Where("slug = ?", "men-collection").First(&menCollection)

	collectionCategories := []models.Category{
		{Name: "Baby Tee", Slug: "baby-tee", Description: "Fitted tees for women collection", CollectionID: &womenCollection.ID},
		{Name: "Crop Top", Slug: "crop-top", Description: "Cropped tops for women collection", CollectionID: &womenCollection.ID},
		{Name: "Oversized Tee", Slug: "women-oversized-tee", Description: "Relaxed oversized tees for women", CollectionID: &womenCollection.ID},
		{Name: "Oversized Tee", Slug: "men-oversized-tee", Description: "Relaxed oversized tees for men", CollectionID: &menCollection.ID},
		{Name: "Hoodie", Slug: "men-hoodie", Description: "Hoodies for men collection", CollectionID: &menCollection.ID},
		{Name: "Shirt", Slug: "men-shirt", Description: "Shirts for men collection", CollectionID: &menCollection.ID},
	}

	for _, category := range collectionCategories {
		if category.CollectionID == nil || *category.CollectionID == 0 {
			continue
		}
		if err := DB.Where(models.Category{Slug: category.Slug}).Assign(category).FirstOrCreate(&category).Error; err != nil {
			log.Printf("Error seeding collection category %s: %v", category.Name, err)
		}
	}
}
