package handlers

import (
	"api/internal/dto"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v5"
)

func Login(c *echo.Context) error {
	var user dto.UserDTO
	if err := echo.BindQueryParams(c, &user); err != nil {
		return c.String(http.StatusBadRequest, "Bad request.")
	}
	
	if user.Username != "test" && user.Password != "test" {
		return c.String(http.StatusUnauthorized, "Wrong username or password.")
	}

	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		secretKey = "SECRET_KEY"
	}
	secret := []byte(secretKey)
	
	claims := jwt.MapClaims{
		"username": user.Username,
		"exp": time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	t, err := token.SignedString(secret)
	if err != nil {
		return err
	}

	return c.JSONPretty(http.StatusOK, t, " ")
}

func Ping(c *echo.Context) error {
	return c.String(http.StatusOK, "Pong!")
}
