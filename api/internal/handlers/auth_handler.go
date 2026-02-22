package handlers

import (
	"api/internal/dto"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v5"
)

func Login(c *echo.Context) error {
	var user dto.UserDTO
	if err := echo.BindQueryParams(c, &user); err != nil {
		return c.String(http.StatusBadRequest, "2")
	}
	fmt.Println(user.Username, user.Password)
	if user.Username != "test" && user.Password != "test" {
		return c.String(http.StatusOK, "1")
	}
	return c.String(http.StatusOK, "0")
}
