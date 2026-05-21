package handlers

import (
	"backend-shirtieza/config"
	"backend-shirtieza/utils"
	"net/http"

	"github.com/vandyahmad24/golang-wilayah-indonesia/wilayah"
)

func GetProvinces(w http.ResponseWriter, r *http.Request) {
	var provinces []wilayah.Province
	if err := config.DB.Table("provinces").Order("name ASC").Find(&provinces).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch provinces", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Provinces fetched successfully", provinces)
}

func GetCities(w http.ResponseWriter, r *http.Request) {
	provinceID := r.URL.Query().Get("province_id")
	query := config.DB.Table("cities").Order("name ASC")
	if provinceID != "" {
		query = query.Where("province_id = ?", provinceID)
	}
	var cities []wilayah.City
	if err := query.Find(&cities).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch cities", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Cities fetched successfully", cities)
}

func GetDistricts(w http.ResponseWriter, r *http.Request) {
	cityID := r.URL.Query().Get("city_id")
	query := config.DB.Table("districts").Order("name ASC")
	if cityID != "" {
		query = query.Where("city_id = ?", cityID)
	}
	var districts []wilayah.District
	if err := query.Find(&districts).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch districts", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Districts fetched successfully", districts)
}

func GetVillages(w http.ResponseWriter, r *http.Request) {
	districtID := r.URL.Query().Get("district_id")
	query := config.DB.Table("villages").Order("name ASC")
	if districtID != "" {
		query = query.Where("district_id = ?", districtID)
	}
	var villages []wilayah.Village
	if err := query.Find(&villages).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch villages", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Villages fetched successfully", villages)
}
