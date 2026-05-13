package config

import (
	"fmt"
	"log"

	"backend-shirtieza/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var err error
	// Menggunakan Mysql untuk development, bisa diganti dengan PostgreSQL/SQLite di production
	dsn := "root:@tcp(127.0.0.1:3306)/shirtieza_db?charset=utf8mb4&parseTime=True&loc=Local"
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	fmt.Println("✅ Database connected successfully")

	// Auto migrate semua models
	err = DB.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Collection{},
		&models.Product{},
		&models.ProductReview{},
		&models.Cart{},
		&models.CartItem{},
		&models.Order{},
		&models.OrderItem{},
	)

	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	fmt.Println("✅ Database migration completed")

	// Seed initial data
	SeedDatabase()
}

func CloseDB() {
	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatalf("Failed to get DB instance: %v", err)
	}
	sqlDB.Close()
}
