package router

import (
	"api/internal/handlers"

	"github.com/labstack/echo/v5"
)

func Router(e *echo.Echo) {
	e.GET("/login", handlers.Login)
}
