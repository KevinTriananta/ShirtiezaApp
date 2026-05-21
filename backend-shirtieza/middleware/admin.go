package middleware

import (
	"backend-shirtieza/utils"
	"net/http"
)

func AdminMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if CurrentUserRole(r) != "admin" {
			utils.RespondWithError(w, http.StatusForbidden, "Forbidden", "Admin access required")
			return
		}
		next.ServeHTTP(w, r)
	})
}
