package main

import (
	"context"
	"os"
	"server/internal/handlers"

	"github.com/redis/go-redis/v9"
)

func main() {
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

	for {
		task, _ := rdb.BRPop(ctx, 0, "getSecret").Result()
		switch task[0] {
			case "getSecret":
				handlers.GetSecret(ctx, rdb, task[1])
		}
	}
}
