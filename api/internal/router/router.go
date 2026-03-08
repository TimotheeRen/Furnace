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
	logged.GET("/serverInfo", handlers.ServerInfo)
	logged.GET("/console", handlers.ServerConsole)
	logged.POST("/command", handlers.SendCommand)
	logged.GET("/getSftpPort", handlers.GetSftpPort)
	logged.GET("/getCronjobs", handlers.GetCronjobs)
	logged.POST("/createCronjob", handlers.CreateCronjob)
	logged.POST("/deleteCronjob", handlers.DeleteCronjob)
}
