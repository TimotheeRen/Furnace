package handlers

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

func GetSecret(ctx context.Context, rdb *redis.Client, payload string) {
	fmt.Println("SECRET")
	rdb.LPush(ctx, "getSecretResponse", "SECRET")
	rdb.Expire(ctx, "getSecretResponse", 3*time.Second)
}
