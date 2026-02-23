package handlers

import (
	"context"
	"encoding/json"
	"server/internal/dto"
	"time"

	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/types"

	"github.com/redis/go-redis/v9"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

func GetSecret(ctx context.Context, rdb *redis.Client, client client.Client, payload string) {
	secret := &corev1.Secret{}
	location := types.NamespacedName{
		Name: "furnace-credentials",
		Namespace: "default",
	}

	err := client.Get(ctx, location, secret)
	if err != nil {
		rdb.LPush(ctx, "getSecretResponse", "ERROR")
	}

	
	userSecret := dto.SecretDTO{
		Username: string(secret.Data["username"]),
		Password: string(secret.Data["password"]),
	}

	userSecretJson, _ := json.Marshal(userSecret)

	rdb.LPush(ctx, "getSecretResponse", userSecretJson)
	rdb.Expire(ctx, "getSecretResponse", 3*time.Second)
}
