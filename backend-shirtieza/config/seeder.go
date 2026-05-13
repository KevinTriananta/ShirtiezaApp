package config

import (
	"log"

	"backend-shirtieza/models"

	"golang.org/x/crypto/bcrypt"
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

	// Seed Products
	products := []models.Product{
		{
			Name:        "Signature Oversized Hoodie",
			Slug:        "signature-oversized-hoodie",
			Description: "Premium heavy cotton oversized hoodie in midnight black.",
			Price:       899000,
			Stock:       50,
			Image:       "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800",
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
			CategoryID:  2, // Caps & Bags
		},
		{
			Name:        "Essential White Tee",
			Slug:        "essential-white-tee",
			Description: "Premium 24s cotton white t-shirt, perfect for layering.",
			Price:       249000,
			Stock:       200,
			Image:       "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800",
			CategoryID:  3, // Trending
		},
		{
			Name:        "Cargo Tech Pants",
			Slug:        "cargo-tech-pants",
			Description: "Multi-pocket cargo pants with adjustable straps.",
			Price:       749000,
			Stock:       40,
			Image:       "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800",
			CategoryID:  3, // Trending
		},
		{
			Name:        "Silver Chain Link",
			Slug:        "silver-chain-link",
			Description: "Stainless steel chain with polished finish.",
			Price:       159000,
			Stock:       150,
			Image:       "https://images.unsplash.com/photo-1599643478123-537346a07993?q=80&w=800",
			CategoryID:  5, // Accessories
		},
	}

	for _, product := range products {
		if err := DB.FirstOrCreate(&product, models.Product{Slug: product.Slug}).Error; err != nil {
			log.Printf("Error seeding product %s: %v", product.Name, err)
		}
	}

	// Seed Admin User
	adminEmail := "admin@shirtieza.com"
	var admin models.User
	if err := DB.Where("email = ?", adminEmail).First(&admin).Error; err != nil {
		// Create admin if not exists
		password := "admin123"
		hashed, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		adminUser := models.User{
			Name:     "Shirtieza Admin",
			Email:    adminEmail,
			Password: string(hashed),
			Role:     "admin",
		}
		if err := DB.Create(&adminUser).Error; err == nil {
			log.Println("👤 Admin user created (admin@shirtieza.com / admin123)")
		}
	}

	log.Println("✅ Database seeding completed successfully")
}
