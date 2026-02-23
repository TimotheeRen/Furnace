package main

import (
	"context"
	"fmt"
	"os"
	"server/internal/handlers"
	"time"

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
		task, err := rdb.BRPop(ctx, 0, "getSecret").Result()
		if err != nil {
			fmt.Printf("Erreur Redis: %v. Nouvel essai dans 5s...\n", err)
            time.Sleep(5 * time.Second)
            continue
		}
		switch task[0] {
			case "getSecret":
				handlers.GetSecret(ctx, rdb, task[1])
		}
	}
}
