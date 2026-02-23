package handlers

import (
	"api/internal/dto"
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v5"
	"github.com/redis/go-redis/v9"
)

type AuthHandler struct {
	RDB *redis.Client
}

func Login(c *echo.Context) error {

	var user dto.UserDTO
	if err := echo.BindQueryParams(c, &user); err != nil {
		return c.String(http.StatusBadRequest, "Bad request.")
	}
		
	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = "localhost:6379"
	}

	rdb := redis.NewClient(&redis.Options{
		Addr: redisHost,
		Password: "",
		DB: 0,
	})

	ctx := context.Background()

	streamKey := "events"
	args := &redis.XAddArgs{
		Stream: streamKey,
		Values: map[string]interface{}{
			"action": "getSecret",
			"time": time.Now().Format(time.RFC3339),
		},
	}
	res, err := rdb.XAdd(ctx, args).Result()
	if err != nil {
		return c.String(http.StatusInternalServerError, "Redis connection failed")
	}
	fmt.Println(res)

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

	return c.String(http.StatusOK, t)
}

func Ping(c *echo.Context) error {
	return c.String(http.StatusOK, "Pong!")
}
