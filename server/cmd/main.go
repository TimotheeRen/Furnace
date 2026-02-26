package main

import (
	"context"
	"fmt"
	"os"
	"server/internal/handlers"
	"time"

	"github.com/redis/go-redis/v9"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/client/config"
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

	cfg, err := config.GetConfig()
	if err != nil {
		panic(err)
	}

	client, err := client.New(cfg, client.Options{})
	if err != nil {
		panic(err)
	}

	for {
		task, err := rdb.BRPop(ctx, 0, "getSecret", "createServer", "getServers").Result()
		if err != nil {
			fmt.Printf("Erreur Redis: %v. Nouvel essai dans 5s...\n", err)
            time.Sleep(5 * time.Second)
            continue
		}
		switch task[0] {
			case "getSecret":
				handlers.GetSecret(ctx, rdb, client, task[1])
			case "createServer":
				handlers.CreateServer(ctx, rdb, client, task[1])
			case "getServers":
				handlers.GetServers(ctx, rdb, client, task[1])
		}
	}
}
