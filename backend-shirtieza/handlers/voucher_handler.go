package handlers

import (
	"backend-shirtieza/config"
	"backend-shirtieza/middleware"
	"backend-shirtieza/models"
	"backend-shirtieza/utils"
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
	"time"
)

func GetActiveVouchers(w http.ResponseWriter, r *http.Request) {
	var vouchers []models.Voucher
	if err := config.DB.Preload("Category").Where("is_active = ? AND expires_at > ?", true, time.Now()).Order("created_at DESC").Find(&vouchers).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch vouchers", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Vouchers fetched successfully", vouchers)
}

func GetUserVouchers(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.CurrentUserID(r)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}
	var userVouchers []models.UserVoucher
	if err := config.DB.Preload("Voucher").Preload("Voucher.Category").Where("user_id = ?", userID).Order("created_at DESC").Find(&userVouchers).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch user vouchers", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "User vouchers fetched successfully", userVouchers)
}

func ClaimVoucher(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.CurrentUserID(r)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}
	voucherID, _ := strconv.Atoi(mux.Vars(r)["id"])
	var voucher models.Voucher
	if err := config.DB.Where("id = ? AND is_active = ? AND expires_at > ?", voucherID, true, time.Now()).First(&voucher).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Voucher not found or expired", err.Error())
		return
	}
	userVoucher := models.UserVoucher{UserID: userID, VoucherID: voucher.ID}
	if err := config.DB.FirstOrCreate(&userVoucher, models.UserVoucher{UserID: userID, VoucherID: voucher.ID}).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to claim voucher", err.Error())
		return
	}
	config.DB.Preload("Voucher").First(&userVoucher, userVoucher.ID)
	utils.RespondWithSuccess(w, http.StatusCreated, "Voucher claimed successfully", userVoucher)
}

func AdminGetVouchers(w http.ResponseWriter, r *http.Request) {
	var vouchers []models.Voucher
	if err := config.DB.Preload("Category").Order("created_at DESC").Find(&vouchers).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch vouchers", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Vouchers fetched successfully", vouchers)
}

func AdminCreateVoucher(w http.ResponseWriter, r *http.Request) {
	var voucher models.Voucher
	if err := json.NewDecoder(r.Body).Decode(&voucher); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}
	if voucher.DiscountPercentage <= 0 || voucher.DiscountPercentage > 100 {
		utils.RespondWithError(w, http.StatusBadRequest, "Discount percentage must be between 1 and 100", nil)
		return
	}
	if voucher.ExpiresAt.IsZero() {
		utils.RespondWithError(w, http.StatusBadRequest, "Expiration date is required", nil)
		return
	}
	voucher.IsActive = true
	if err := config.DB.Create(&voucher).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to create voucher", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusCreated, "Voucher created successfully", voucher)
}

func AdminUpdateVoucher(w http.ResponseWriter, r *http.Request) {
	voucherID := mux.Vars(r)["id"]
	var voucher models.Voucher
	if err := config.DB.First(&voucher, voucherID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Voucher not found", err.Error())
		return
	}
	if err := json.NewDecoder(r.Body).Decode(&voucher); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}
	if err := config.DB.Save(&voucher).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to update voucher", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Voucher updated successfully", voucher)
}

func AdminDeleteVoucher(w http.ResponseWriter, r *http.Request) {
	if err := config.DB.Delete(&models.Voucher{}, mux.Vars(r)["id"]).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to delete voucher", err.Error())
		return
	}
	utils.RespondWithSuccess(w, http.StatusOK, "Voucher deleted successfully", nil)
}
