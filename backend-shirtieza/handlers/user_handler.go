package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"backend-shirtieza/config"
	"backend-shirtieza/models"
	"backend-shirtieza/utils"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = func() []byte {
	if s := os.Getenv("JWT_SECRET"); s != "" {
		return []byte(s)
	}
	return []byte("shirtieza-secret-key-2024")
}()

func generateToken(user models.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func userResponse(user models.User) models.UserResponse {
	return models.UserResponse{
		ID:      user.ID,
		Name:    user.Name,
		Email:   user.Email,
		Phone:   user.Phone,
		Address: user.Address,
		City:    user.City,
		Country: user.Country,
		Avatar:  user.Avatar,
		Role:    user.Role,
	}
}

// RegisterUser - Mendaftar user baru
func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
		Phone    string `json:"phone"`
		Address  string `json:"address"`
		City     string `json:"city"`
		Country  string `json:"country"`
		ZipCode  string `json:"zip_code"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}

	if input.Email == "" || input.Name == "" || input.Password == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Name, email, and password are required", nil)
		return
	}

	// Check email already exists
	var existing models.User
	if err := config.DB.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		utils.RespondWithError(w, http.StatusConflict, "Email already registered", nil)
		return
	}

	// Hash password
	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to process password", err.Error())
		return
	}

	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hashed),
		Phone:    input.Phone,
		Address:  input.Address,
		City:     input.City,
		Country:  input.Country,
		ZipCode:  input.ZipCode,
		Role:     "customer",
	}

	if err := config.DB.Create(&user).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to register user", err.Error())
		return
	}

	token, err := generateToken(user)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to generate token", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusCreated, "User registered successfully", map[string]interface{}{
		"user":  userResponse(user),
		"token": token,
	})
}

// LoginUser - Login user dengan bcrypt + JWT
func LoginUser(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}

	if input.Email == "" || input.Password == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Email and password are required", nil)
		return
	}

	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Invalid email or password", nil)
		return
	}

	// Compare password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Invalid email or password", nil)
		return
	}

	token, err := generateToken(user)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to generate token", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Login successful", map[string]interface{}{
		"user":  userResponse(user),
		"token": token,
	})
}

// GetUserProfile - Mendapatkan profil user
func GetUserProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["id"]

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "User not found", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "User profile fetched successfully", userResponse(user))
}

// UpdateUserProfile - Update profil user
func UpdateUserProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["id"]

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "User not found", err.Error())
		return
	}

	var input struct {
		Name    string `json:"name"`
		Phone   string `json:"phone"`
		Address string `json:"address"`
		City    string `json:"city"`
		Country string `json:"country"`
		ZipCode string `json:"zip_code"`
		Avatar  string `json:"avatar"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}

	if err := config.DB.Model(&user).Updates(map[string]interface{}{
		"name":    input.Name,
		"phone":   input.Phone,
		"address": input.Address,
		"city":    input.City,
		"country": input.Country,
		"zip_code": input.ZipCode,
		"avatar":  input.Avatar,
	}).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to update profile", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Profile updated successfully", userResponse(user))
}

// GetUserOrders - Mendapatkan orders user
func GetUserOrders(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["id"]

	var orders []models.Order
	if err := config.DB.
		Where("user_id = ?", userID).
		Preload("Items").
		Preload("Items.Product").
		Order("created_at DESC").
		Find(&orders).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch orders", err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Orders fetched successfully", orders)
}

// GetAllUsers - Mendapatkan semua user (Admin only)
func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	var users []models.User
	if err := config.DB.Order("created_at DESC").Find(&users).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch users", err.Error())
		return
	}

	var responses []models.UserResponse
	for _, user := range users {
		responses = append(responses, userResponse(user))
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Users fetched successfully", responses)
}
