package config

import (
	"backend-shirtieza/models"
	"golang.org/x/crypto/bcrypt"
	"log"
)

func SeedDatabase() {
	// Seed categories
	categories := []models.Category{
		{
			Name:        "Hoodie",
			Slug:        "hoodie",
			Description: "Comfortable and warm hoodies for all seasons",
			Icon:        "👕",
		},
		{
			Name:        "Caps & Bags",
			Slug:        "caps-bags",
			Description: "Stylish caps and bags for every occasion",
			Icon:        "🎩",
		},
		{
			Name:        "Trending",
			Slug:        "trending",
			Description: "Latest trending fashion items",
			Icon:        "🔥",
		},
		{
			Name:        "Out Wear",
			Slug:        "outwear",
			Description: "Jackets, coats, and outerwear",
			Icon:        "🧥",
		},
		{
			Name:        "Accessories",
			Slug:        "accessories",
			Description: "Fashion accessories and more",
			Icon:        "✨",
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
	// Seed Products
	products := []models.Product{
		{
			Name:        "Signature Oversized Hoodie",
			Slug:        "signature-oversized-hoodie",
			Description: "Premium heavy cotton oversized hoodie in midnight black.",
			Price:       899000,
			Stock:       50,
			Image:       "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800",
			Images:      `["https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200","https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=1200"]`,
			Colors:      `["Black","Stone","Navy"]`,
			Rating:      4.8,
			ReviewCount: 128,
			CategoryID:  1, // Hoodie
			IsFeatured:  true,
		},
		{
			Name:        "Urban Street Cap",
			Slug:        "urban-street-cap",
			Description: "Distressed cotton cap with embroidered logo.",
			Price:       299000,
			Stock:       100,
			Image:       "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800",
			Colors:      `["Black","Khaki","Olive"]`,
			Rating:      4.6,
			ReviewCount: 84,
			CategoryID:  2, // Caps & Bags
			IsFeatured:  true,
		},
		{
			Name:        "Cyberpunk Bomber Jacket",
			Slug:        "cyberpunk-bomber-jacket",
			Description: "Water-resistant techwear bomber with futuristic details.",
			Price:       1299000,
			Stock:       25,
			Image:       "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800",
			Colors:      `["Black","Charcoal"]`,
			Rating:      4.9,
			ReviewCount: 52,
			CategoryID:  4, // Out Wear
			IsFeatured:  true,
		},
		{
			Name:        "Minimalist Tote Bag",
			Slug:        "minimalist-tote-bag",
			Description: "Heavy canvas tote bag for daily essentials.",
			Price:       199000,
			Stock:       75,
			Image:       "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800",
			Colors:      `["Natural","Black"]`,
			Rating:      4.5,
			ReviewCount: 41,
			CategoryID:  2, // Caps & Bags
		},
		{
			Name:        "Essential White Tee",
			Slug:        "essential-white-tee",
			Description: "Premium 24s cotton white t-shirt, perfect for layering.",
			Price:       249000,
			Stock:       200,
			Image:       "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800",
			Colors:      `["White","Black","Grey"]`,
			Rating:      4.7,
			ReviewCount: 203,
			CategoryID:  3, // Trending
		},
		{
			Name:        "Cargo Tech Pants",
			Slug:        "cargo-tech-pants",
			Description: "Multi-pocket cargo pants with adjustable straps.",
			Price:       749000,
			Stock:       40,
			Image:       "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800",
			Colors:      `["Black","Olive","Sand"]`,
			Rating:      4.8,
			ReviewCount: 67,
			CategoryID:  3, // Trending
		},
		{
			Name:        "Silver Chain Link",
			Slug:        "silver-chain-link",
			Description: "Stainless steel chain with polished finish.",
			Price:       159000,
			Stock:       150,
			Image:       "https://images.unsplash.com/photo-1599643478123-537346a07993?q=80&w=800",
			Colors:      `["Silver"]`,
			Rating:      4.4,
			ReviewCount: 33,
			CategoryID:  5, // Accessories
		},
		{
			Name:        "Washed Denim Overshirt",
			Slug:        "washed-denim-overshirt",
			Description: "Boxy denim overshirt with garment-washed texture and matte buttons.",
			Price:       679000,
			Stock:       35,
			Image:       "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800",
			Colors:      `["Washed Blue","Black"]`,
			Rating:      4.7,
			ReviewCount: 58,
			CategoryID:  4,
			IsFeatured:  true,
		},
		{
			Name:        "Ribbed Everyday Socks",
			Slug:        "ribbed-everyday-socks",
			Description: "Three-pack ribbed socks with soft cotton blend and reinforced toe.",
			Price:       129000,
			Stock:       180,
			Image:       "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800",
			Colors:      `["White","Black","Grey"]`,
			Rating:      4.3,
			ReviewCount: 76,
			CategoryID:  5,
		},
	}
	for _, product := range products {
		if err := DB.Where(models.Product{Slug: product.Slug}).Assign(product).FirstOrCreate(&product).Error; err != nil {
			log.Printf("Error seeding product %s: %v", product.Name, err)
		}
	}
	var newArrivals models.Collection
	if err := DB.Where("slug = ?", "new-arrivals").First(&newArrivals).Error; err == nil {
		var seededProducts []models.Product
		DB.Limit(6).Find(&seededProducts)
		DB.Model(&newArrivals).Association("Products").Replace(seededProducts)
	}
	// Seed Admin User
	adminEmail := "admin@shirtieza.com"
	var admin models.User
	adminPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err := DB.Where("email = ?", adminEmail).First(&admin).Error; err != nil {
		adminUser := models.User{
			Name:     "Shirtieza Admin",
			Email:    adminEmail,
			Password: string(adminPassword),
			Role:     "admin",
		}
		if err := DB.Create(&adminUser).Error; err == nil {
			log.Println("👤 Admin user created (admin@shirtieza.com / admin123)")
		}
	} else {
		DB.Model(&admin).Updates(map[string]interface{}{
			"name":     "Shirtieza Admin",
			"password": string(adminPassword),
			"role":     "admin",
		})
	}
	// Seed Demo Customer + Orders for a ready-to-present dashboard
	demoEmail := "customer@shirtieza.com"
	var demoUser models.User
	if err := DB.Where("email = ?", demoEmail).First(&demoUser).Error; err != nil {
		hashed, _ := bcrypt.GenerateFromPassword([]byte("customer123"), bcrypt.DefaultCost)
		demoUser = models.User{
			Name:     "Raka Pratama",
			Email:    demoEmail,
			Password: string(hashed),
			Phone:    "+6281234567890",
			Address:  "Jl. Senopati No. 12",
			City:     "Jakarta",
			Country:  "Indonesia",
			ZipCode:  "12190",
			Role:     "customer",
		}
		DB.Create(&demoUser)
	}
	var orderCount int64
	DB.Model(&models.Order{}).Where("user_id = ?", demoUser.ID).Count(&orderCount)
	if orderCount == 0 && demoUser.ID != 0 {
		var hoodie models.Product
		var cap models.Product
		DB.Where("slug = ?", "signature-oversized-hoodie").First(&hoodie)
		DB.Where("slug = ?", "urban-street-cap").First(&cap)
		order := models.Order{
			OrderNumber:     "ORD-DEMO-001",
			UserID:          demoUser.ID,
			ShippingAddress: demoUser.Address,
			ShippingCity:    demoUser.City,
			ShippingCountry: demoUser.Country,
			ShippingZip:     demoUser.ZipCode,
			Subtotal:        hoodie.Price + cap.Price,
			ShippingCost:    25000,
			Tax:             0,
			Total:           hoodie.Price + cap.Price + 25000,
			Status:          "processing",
			PaymentStatus:   "paid",
			PaymentMethod:   "bank_transfer",
			Items: []models.OrderItem{
				{ProductID: hoodie.ID, Quantity: 1, Price: hoodie.Price},
				{ProductID: cap.ID, Quantity: 1, Price: cap.Price},
			},
		}
		DB.Create(&order)
	}
	var cart models.Cart
	if err := DB.Where("user_id = ?", demoUser.ID).First(&cart).Error; err != nil && demoUser.ID != 0 {
		DB.Create(&models.Cart{UserID: demoUser.ID})
	}
	log.Println("✅ Database seeding completed successfully")
}

func seedCollectionCategories() {
	var womenCollection models.Collection
	var menCollection models.Collection
	DB.Where("slug = ?", "women-collection").First(&womenCollection)
	DB.Where("slug = ?", "men-collection").First(&menCollection)

	collectionCategories := []models.Category{
		{Name: "Baby Tee", Slug: "baby-tee", Description: "Fitted tees for women collection", Icon: "T", CollectionID: &womenCollection.ID},
		{Name: "Crop Top", Slug: "crop-top", Description: "Cropped tops for women collection", Icon: "T", CollectionID: &womenCollection.ID},
		{Name: "Women Oversized Tee", Slug: "women-oversized-tee", Description: "Relaxed oversized tees for women", Icon: "T", CollectionID: &womenCollection.ID},
		{Name: "Men Oversized Tee", Slug: "men-oversized-tee", Description: "Relaxed oversized tees for men", Icon: "T", CollectionID: &menCollection.ID},
		{Name: "Men Hoodie", Slug: "men-hoodie", Description: "Hoodies for men collection", Icon: "H", CollectionID: &menCollection.ID},
		{Name: "Men Shirt", Slug: "men-shirt", Description: "Shirts for men collection", Icon: "S", CollectionID: &menCollection.ID},
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
