package main

import (
	"context"
	"fmt"
	"os"
	"server/internal/handlers"
	"server/internal/jobs"
	"time"

	"github.com/redis/go-redis/v9"
	"k8s.io/client-go/kubernetes"
	metricsv "k8s.io/metrics/pkg/client/clientset/versioned"
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

	k8sClientset, _ := kubernetes.NewForConfig(cfg)

	metricsClient, err := metricsv.NewForConfig(cfg)
	if err != nil {
		fmt.Println(err)
	}

	go func() {
		ticker := time.NewTicker(5 * time.Second)
		defer ticker.Stop()

		for {
			select {
			case <- ticker.C:
				jobs.GetResources(ctx, rdb, client, metricsClient)
			case <- ctx.Done():
				return
			}
		}
	}()

	go jobs.ConsoleStream(ctx, rdb, k8sClientset, metricsClient)

	for {
		task, err := rdb.BRPop(ctx, 0, "getSecret", "createServer", "getServers", "serverInfo", "command", "getSftpPort", "getCronjobs").Result()
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
			case "serverInfo":
				handlers.ServerInfo(ctx, rdb, client, task[1], metricsClient)
			case "command":
				handlers.Command(ctx, rdb, client, task[1], k8sClientset, cfg)
			case "getSftpPort":
				handlers.GetSftpPort(ctx, rdb, client, task[1])
			case "getCronjobs":
				handlers.GetCronjobs(ctx, rdb, client, task[1], k8sClientset, cfg)
		}
	}
}
