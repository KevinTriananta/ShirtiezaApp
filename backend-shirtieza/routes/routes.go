package routes

import (
	"github.com/gorilla/mux"
	"net/http"
)

func SetupRoutes() *mux.Router {
	router := mux.NewRouter()
	// Setup v1 API routes
	SetupV1Routes(router)
	router.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))
	return router
}
