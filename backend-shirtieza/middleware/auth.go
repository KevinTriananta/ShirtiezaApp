package middleware

import (
	"context"
	"net/http"
	"os"
	"strings"

	"backend-shirtieza/utils"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const (
	UserIDKey   contextKey = "user_id"
	UserRoleKey contextKey = "user_role"
)

func jwtSecret() []byte {
	if s := os.Getenv("JWT_SECRET"); s != "" {
		return []byte(s)
	}
	return []byte("shirtieza-secret-key-2024")
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized", "Missing bearer token")
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrTokenSignatureInvalid
			}
			return jwtSecret(), nil
		})

		if err != nil || !token.Valid {
			utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized", "Invalid or expired token")
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized", "Invalid token claims")
			return
		}

		userID, ok := claims["user_id"].(float64)
		if !ok {
			utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized", "Invalid user claim")
			return
		}

		role, _ := claims["role"].(string)
		ctx := context.WithValue(r.Context(), UserIDKey, uint(userID))
		ctx = context.WithValue(ctx, UserRoleKey, role)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func CurrentUserID(r *http.Request) (uint, bool) {
	userID, ok := r.Context().Value(UserIDKey).(uint)
	return userID, ok
}

func CurrentUserRole(r *http.Request) string {
	role, _ := r.Context().Value(UserRoleKey).(string)
	return role
}
