package config

import (
	"backend-shirtieza/models"
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
	"strings"
)

var DB *gorm.DB

func InitDB() {
	var err error
	dsn := os.Getenv("DATABASE_DSN")
	if dsn == "" {
		dsn = "root:@tcp(127.0.0.1:3306)/shirtieza_db?charset=utf8mb4&parseTime=True&loc=Local"
	}
	DB, err = gorm.Open(databaseDialector(dsn), &gorm.Config{})
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
		&models.Voucher{},
		&models.UserVoucher{},
		&models.WishlistItem{},
		&models.Order{},
		&models.OrderItem{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
	if DB.Migrator().HasIndex(&models.Category{}, "idx_categories_name") {
		if err := DB.Migrator().DropIndex(&models.Category{}, "idx_categories_name"); err != nil {
			log.Printf("Warning: failed to drop old category name unique index: %v", err)
		}
	}
	fmt.Println("✅ Database migration completed")
}

func databaseDialector(dsn string) gorm.Dialector {
	driver := strings.ToLower(strings.TrimSpace(os.Getenv("DB_DRIVER")))
	if driver == "" && strings.HasPrefix(strings.ToLower(dsn), "postgres") {
		driver = "postgres"
	}
	if driver == "postgres" || driver == "postgresql" {
		return postgres.Open(dsn)
	}
	return mysql.Open(dsn)
}

func CloseDB() {
	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatalf("Failed to get DB instance: %v", err)
	}
	sqlDB.Close()
}
