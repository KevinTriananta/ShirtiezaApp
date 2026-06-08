package config

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/vandyahmad24/golang-wilayah-indonesia/wilayah"
	"gorm.io/gorm/clause"
)

func MigrateAndSeedWilayah() {
	sqlDB, err := DB.DB()
	if err != nil {
		log.Printf("Wilayah database connection error: %v", err)
		return
	}
	if err := migrateWilayah(sqlDB); err != nil {
		log.Printf("Wilayah migration error: %v", err)
		return
	}
	if err := seedWilayah(sqlDB, wilayahDataPath()); err != nil {
		log.Printf("Wilayah seed error: %v", err)
		return
	}
	log.Println("✅ Wilayah migration and seed completed")
}

func migrateWilayah(db *sql.DB) error {
	queries := wilayahMigrationQueries()
	for _, query := range queries {
		if _, err := db.Exec(query); err != nil {
			return err
		}
	}
	return nil
}

func wilayahMigrationQueries() []string {
	if DB != nil && DB.Dialector.Name() == "postgres" {
		return []string{
			`CREATE TABLE IF NOT EXISTS provinces (id INTEGER PRIMARY KEY, name VARCHAR(100) NOT NULL, code VARCHAR(10) NOT NULL)`,
			`CREATE TABLE IF NOT EXISTS cities (id INTEGER PRIMARY KEY, type VARCHAR(50) NOT NULL, name VARCHAR(100) NOT NULL, code VARCHAR(10) NOT NULL, full_code VARCHAR(10) NOT NULL, province_id INTEGER NOT NULL)`,
			`CREATE INDEX IF NOT EXISTS idx_cities_province_id ON cities (province_id)`,
			`CREATE TABLE IF NOT EXISTS districts (id INTEGER PRIMARY KEY, name VARCHAR(100) NOT NULL, code VARCHAR(10) NOT NULL, full_code VARCHAR(10) NOT NULL, city_id INTEGER NOT NULL)`,
			`CREATE INDEX IF NOT EXISTS idx_districts_city_id ON districts (city_id)`,
			`CREATE TABLE IF NOT EXISTS villages (id INTEGER PRIMARY KEY, name VARCHAR(100) NOT NULL, code VARCHAR(10) NOT NULL, full_code VARCHAR(10) NOT NULL, pos_code VARCHAR(10) NOT NULL, district_id INTEGER NOT NULL)`,
			`CREATE INDEX IF NOT EXISTS idx_villages_district_id ON villages (district_id)`,
		}
	}
	return []string{
		`CREATE TABLE IF NOT EXISTS provinces (id INT PRIMARY KEY, name VARCHAR(100) NOT NULL, code VARCHAR(10) NOT NULL)`,
		`CREATE TABLE IF NOT EXISTS cities (id INT PRIMARY KEY, type VARCHAR(50) NOT NULL, name VARCHAR(100) NOT NULL, code VARCHAR(10) NOT NULL, full_code VARCHAR(10) NOT NULL, province_id INT NOT NULL, INDEX idx_cities_province_id (province_id))`,
		`CREATE TABLE IF NOT EXISTS districts (id INT PRIMARY KEY, name VARCHAR(100) NOT NULL, code VARCHAR(10) NOT NULL, full_code VARCHAR(10) NOT NULL, city_id INT NOT NULL, INDEX idx_districts_city_id (city_id))`,
		`CREATE TABLE IF NOT EXISTS villages (id INT PRIMARY KEY, name VARCHAR(100) NOT NULL, code VARCHAR(10) NOT NULL, full_code VARCHAR(10) NOT NULL, pos_code VARCHAR(10) NOT NULL, district_id INT NOT NULL, INDEX idx_villages_district_id (district_id))`,
	}
}

func seedWilayah(db *sql.DB, dataPath string) error {
	if err := seedWilayahTable("provinces", filepath.Join(dataPath, "provinsi.json"), func(items []wilayah.Province) error {
		return insertWilayahBatch("provinces", items)
	}); err != nil {
		return err
	}
	if err := seedWilayahTable("cities", filepath.Join(dataPath, "kota.json"), func(items []wilayah.City) error {
		return insertWilayahBatch("cities", items)
	}); err != nil {
		return err
	}
	if err := seedWilayahTable("districts", filepath.Join(dataPath, "kecamatan.json"), func(items []wilayah.District) error {
		return insertWilayahBatch("districts", items)
	}); err != nil {
		return err
	}
	return seedWilayahTable("villages", filepath.Join(dataPath, "kelurahan.json"), func(items []wilayah.Village) error {
		return insertWilayahBatch("villages", items)
	})
}

func seedWilayahTable[T any](table string, path string, insert func([]T) error) error {
	var count int64
	if err := DB.Table(table).Count(&count).Error; err != nil {
		log.Printf("%s seed check error: %v", table, err)
		return err
	}

	items, err := readSeedJSON[T](path)
	if err != nil {
		if os.IsNotExist(err) {
			log.Printf("%s seed skipped: %s not found", table, path)
			return nil
		}
		return err
	}
	if count >= int64(len(items)) {
		log.Printf("%s seed skipped: %d/%d rows already exist", table, count, len(items))
		return nil
	}
	log.Printf("%s seed continuing: %d/%d rows exist", table, count, len(items))
	return insert(items)
}

func insertWilayahBatch[T any](table string, items []T) error {
	if len(items) == 0 {
		return nil
	}
	if err := DB.Table(table).Clauses(clause.OnConflict{DoNothing: true}).CreateInBatches(items, 1000).Error; err != nil {
		log.Printf("%s seed batch error: %v", table, err)
		return err
	}
	log.Printf("Seeded %s: %d rows processed", table, len(items))
	return nil
}

func readSeedJSON[T any](path string) ([]T, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()
	var items []T
	if err := json.NewDecoder(file).Decode(&items); err != nil {
		return nil, fmt.Errorf("decode %s: %w", path, err)
	}
	return items, nil
}

func wilayahDataPath() string {
	if path := os.Getenv("WILAYAH_DATA_PATH"); path != "" {
		return path
	}
	if _, err := os.Stat("data/provinsi.json"); err == nil {
		return "data"
	}
	log.Println("Wilayah data path not found. Set WILAYAH_DATA_PATH to a folder containing provinsi.json, kota.json, kecamatan.json, and kelurahan.json")
	return "data"
}
