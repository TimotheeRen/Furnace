package handlers

import (
	"api/internal/dto"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v5"
)

func CreateServer(c *echo.Context) error {
	var server dto.ServerDTO
	if err := echo.BindQueryParams(c, &server); err != nil {
		return c.String(http.StatusBadRequest, "Donnees invalides.")
	}
	fmt.Println(server)
	return c.String(http.StatusOK, "OK")
}
