package handlers

import (
	"api/internal/dto"
	"context"
	"encoding/json"
	"net/http"
	"os"

	"github.com/labstack/echo/v5"
	"github.com/redis/go-redis/v9"
)

func CreateServer(c *echo.Context) error {
	var server dto.ServerDTO
	if err := echo.BindQueryParams(c, &server); err != nil {
		return c.String(http.StatusBadRequest, "Donnees invalides.")
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
	payload, _ := json.Marshal(server)
	rdb.LPush(ctx, "createServer", payload)
	return c.String(http.StatusOK, "OK")
}
