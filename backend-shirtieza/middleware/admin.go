package middleware

import (
	"backend-shirtieza/utils"
	"net/http"
)

// AdminMiddleware ensures the user has an admin role
// For now, we'll implement it to look for a header "X-User-Role" 
// In a real app, this would be extracted from a verified JWT token
func AdminMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		role := r.Header.Get("X-User-Role")
		
		// In development or for this demo, we allow if role is admin
		if role != "admin" {
			utils.RespondWithError(w, http.StatusForbidden, "Forbidden", "Admin access required")
			return
		}
		
		next.ServeHTTP(w, r)
	})
}
