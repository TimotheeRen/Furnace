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
	res, err := rdb.BRPop(ctx, 10*time.Second, "serverInfoResponse").Result()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(res)
	return c.Blob(http.StatusOK, "application/json", []byte(res[1]))
}

func ServerConsole(c *echo.Context) error {

	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = "localhost:6379"
	}
	rdb := redis.NewClient(&redis.Options{
		Addr: redisHost,
		Password: "",
		DB: 0,
	})

	ctx := c.Request().Context()

	res := c.Response()
	res.Header().Set(echo.HeaderContentType, "text/event-stream")
	res.Header().Set("Cache-Control", "no-cache")
	res.Header().Set("Connection", "keep-alive")
	res.Header().Set("X-Accel-Buffering", "no")

	flusher, ok := res.(http.Flusher)
	if !ok {
		return c.String(http.StatusInternalServerError, "Le streaming n'est pas supporté par votre serveur")
	}

	podName := c.QueryParam("server") + "-0"
	streamKey := "logs:" + podName
	
	history, _ := rdb.XRevRangeN(ctx, streamKey, "+", "-", 50).Result()
	for i := len(history) - 1; i >= 0; i-- {
		msg := history[i].Values["msg"].(string)
		fmt.Fprintf(res, "data: %s\n\n", msg)
	}

	flusher.Flush()

	lastID := "$"
	if len(history) > 0 {
		lastID = history[0].ID 
	}

	for {
		select {
		case <-ctx.Done():
			return nil
		default:
			streams, err := rdb.XRead(ctx, &redis.XReadArgs{
				Streams: []string{streamKey, lastID},
				Block:   0,
			}).Result()

			if err != nil { continue }

			for _, xmsg := range streams[0].Messages {
				msg := xmsg.Values["msg"].(string)
				fmt.Fprintf(res, "data: %s\n\n", msg)
				flusher.Flush()
				lastID = xmsg.ID
			}
		}
	}
}

func SendCommand(c *echo.Context) error {
	var serverCommand dto.ServerCommand
	if err := echo.BindQueryParams(c, &serverCommand); err != nil {
		return c.String(http.StatusBadRequest, "")
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
	serverJson, err := json.Marshal(serverCommand)
	if err != nil {
		fmt.Println(err)
	}
	rdb.LPush(ctx, "command", serverJson)
	return c.String(http.StatusOK, serverCommand.Command)
}

func GetSftpPort(c *echo.Context) error {
	server := c.QueryParam("server")
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
	rdb.LPush(ctx, "getSftpPort", server) 
	res, err := rdb.BRPop(ctx, 10*time.Second, "getSftpPortResponse").Result()
	if err != nil {
		fmt.Println(err)
		return c.String(http.StatusInternalServerError, "Error")
	}
	fmt.Println(res[1])
	return c.String(http.StatusOK, res[1])
}
