package handlers

import (
	"api/internal/dto"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

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

func GetServers(c *echo.Context) error {
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
	rdb.LPush(ctx, "getServers", "")
	res, _ := rdb.BRPop(ctx, 3*time.Second, "getServersResponse").Result()
	fmt.Println(res[1])
	return c.Blob(http.StatusOK, "application/json", []byte(res[1]))
}

func ServerInfo(c *echo.Context) error {
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
	server := c.QueryParam("server")
	rdb.LPush(ctx, "serverInfo", server)
	res, _ := rdb.BRPop(ctx, 3*time.Second, "serverInfoResponse").Result()
	return c.Blob(http.StatusOK, "application/json", []byte(res[1]))
}
