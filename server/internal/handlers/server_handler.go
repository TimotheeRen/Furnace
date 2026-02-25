package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"server/internal/dto"

	"github.com/redis/go-redis/v9"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

func CreateServer(ctx context.Context, rdb *redis.Client, client client.Client, payload string) {
	var server dto.ServerDTO
	if err := json.Unmarshal([]byte(payload), &server); err != nil {
		fmt.Println(err)
	}

	serverCR := &unstructured.Unstructured{}
	serverCR.SetGroupVersionKind(schema.GroupVersionKind{
		Group: "furnace.com",
		Version: "v1",
		Kind: "Server",
	})
	serverCR.SetName(server.ServerName)
	serverCR.SetNamespace("servers")
	serverCR.SetLabels(map[string]string{
		"app.kubernetes.io/name": "operator",
	})

	serverCR.Object["spec"] = map[string]interface{}{
		"initContainer": "timotheeren/"+server.ServerType+":"+server.ServerVersion,
		"requestMemory": server.MinRam + "Gi",
		"requestCPU": server.MinCpu + "m",
		"limitMemory": server.MaxRam + "Gi",
		"limitCPU": server.MaxCpu + "m",
		"storage": server.Storage + "Gi",
	}

	err := client.Create(ctx, serverCR)
	if err != nil {
		fmt.Printf("k8s Error: %v/n", err)
	}
}
