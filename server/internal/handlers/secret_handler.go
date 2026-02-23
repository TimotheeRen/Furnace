package handlers

import (
	"context"
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
	
	username := string(secret.Data["username"])
	password := string(secret.Data["password"])

	rdb.LPush(ctx, "getSecretResponse", username+" | "+password)
	rdb.Expire(ctx, "getSecretResponse", 3*time.Second)
}
