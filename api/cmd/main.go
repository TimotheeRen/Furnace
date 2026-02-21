package main

import (
	"api/internal/router"
	"fmt"
	"os"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.RequestLogger())
	router.Router(e)

	port := os.Getenv("PORT")
	if port == "" {
		port = "5678"
	}
	address := fmt.Sprintf(":%s", port)

	if err := e.Start(address); err != nil {
		e.Logger.Error("Failed to start server", "error", err)
	}
}
