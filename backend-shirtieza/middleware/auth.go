package middleware

import (
	"net/http"
)

// Auth middleware akan diimplementasikan nanti untuk JWT authentication
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// For now, we'll skip auth. Later implement JWT token validation
		next.ServeHTTP(w, r)
	})
}
