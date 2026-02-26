package router

import (
	"api/internal/handlers"

	"github.com/labstack/echo/v5"
)

func Router(e *echo.Echo, logged *echo.Group) {
	e.GET("/login", handlers.Login)
	logged.GET("/ping", handlers.Ping)
	logged.POST("/createServer", handlers.CreateServer)
	logged.GET("/getServers", handlers.GetServers)
}
