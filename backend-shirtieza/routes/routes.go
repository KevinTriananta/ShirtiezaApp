package routes

import (
	"github.com/gorilla/mux"
)

func SetupRoutes() *mux.Router {
	router := mux.NewRouter()

	// Setup v1 API routes
	SetupV1Routes(router)

	return router
}
