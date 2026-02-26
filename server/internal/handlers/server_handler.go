package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"server/internal/dto"
	"strings"
	"time"

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

	fmt.Println("Server creation...")
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
		fmt.Printf("k8s Error: %v\n", err)
	}
}

func GetServers(ctx context.Context, rdb *redis.Client, k8sClient client.Client, payload string) {
	fmt.Println("Listing servers...")
	serverList := &unstructured.UnstructuredList{}
	serverList.SetGroupVersionKind(schema.GroupVersionKind{
		Group: "furnace.com",
		Version: "v1",
		Kind: "ServerList",
	})

	listOpt := []client.ListOption{
		client.InNamespace("servers"),
	}

	if err := k8sClient.List(ctx, serverList, listOpt...); err != nil {
		fmt.Printf("K8s List Error: %v\n", err)
	}

	var serverStat []dto.ServerStat
	for _, item := range serverList.Items {
		spec := item.Object["spec"].(map[string]interface{})
		serverStat = append(serverStat, dto.ServerStat{
			ServerName: item.GetName(),
			ServerType: strings.Split(spec["initContainer"].(string), "/")[1],
			ServerStatus: "Running",
		})
	}
	jsonServeStat, err := json.Marshal(serverStat)
	if err != nil {
		fmt.Printf("Error encoding JSON: %v\n", err)
	}
	fmt.Println(string(jsonServeStat))
	rdb.LPush(ctx, "getServersResponse", jsonServeStat)
	rdb.Expire(ctx, "getServersResponse", 3*time.Second)
}
