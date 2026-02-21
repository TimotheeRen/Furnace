package handlers

import (
	"net/http"

	"github.com/labstack/echo/v5"
)

func Login(c *echo.Context) error {
	return c.String(http.StatusOK, "Login logic.")
}
