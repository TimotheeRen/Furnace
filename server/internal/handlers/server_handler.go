package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"server/internal/dto"
	"strings"
	"time"

	"github.com/mcstatus-io/mcutil"
	"github.com/redis/go-redis/v9"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
	metricsv "k8s.io/metrics/pkg/client/clientset/versioned"
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
		host := fmt.Sprintf("%s-svc.servers.svc.cluster.local", item.GetName())
		status := "Shutdown"
		_, error := mcutil.Status(host, 25565)
		if error == nil {
			status = "Running"
		} else {
			pod := &corev1.Pod{}
			if err := k8sClient.Get(ctx, client.ObjectKey{Name: item.GetName() + "-0", Namespace: "servers"}, pod); err == nil {
				fmt.Println(error)
				status = "Starting"
			}
		}
		serverStat = append(serverStat, dto.ServerStat{
			ServerName: item.GetName(),
			ServerType: strings.Split(spec["initContainer"].(string), "/")[1],
			ServerStatus: status,
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

func ServerInfo(ctx context.Context, rdb *redis.Client, k8sClient client.Client, payload string, metricsClient *metricsv.Clientset) {
	podName := payload + "-0"
	podMetrics, err := metricsClient.MetricsV1beta1().PodMetricses("servers").Get(context.TODO(), podName, metav1.GetOptions{})
	if err != nil {
		fmt.Println(err)
	}
	container := podMetrics.Containers[0]
	cpu := container.Usage.Cpu().MilliValue()
	mem := container.Usage.Memory().Value() / (1024 * 1024)

	svc := &corev1.Service{}
	err = k8sClient.Get(ctx, client.ObjectKey{Name: payload+"-svc", Namespace: "servers"}, svc)
	if err != nil {
		fmt.Println(err)
	}

	var nodePort int32
	for _, p := range svc.Spec.Ports {
		if p.Port == 25565 || nodePort == 0 {
			nodePort = p.NodePort
		}
	}

	nodeList := &corev1.NodeList{}
	if err := k8sClient.List(ctx, nodeList); err != nil {
		fmt.Println(err)
	}

	nodeIP := nodeList.Items[0].Status.Addresses[0].Address
	address := fmt.Sprintf("%s:%d", nodeIP, nodePort)

	pod := &corev1.Pod{}
	err = k8sClient.Get(ctx, client.ObjectKey{Name: podName, Namespace: "servers"}, pod)
	if err != nil {
		fmt.Println(err)
	}

	podContainer := pod.Spec.Containers[0]
	maxRamQty := podContainer.Resources.Limits.Memory()
	maxMem := maxRamQty.Value() / (1024 * 1024)
	maxCpu := podContainer.Resources.Limits.Cpu().MilliValue()


	cpuPercent := int((float64(cpu) / float64(maxCpu)) * 100)
    memPercent := int((float64(mem) / float64(maxMem)) * 100)

	// host := fmt.Sprintf("%s-svc.servers.svc.cluster.local", payload)
	status := "Shutdown"
	res, err := mcutil.Status(nodeIP, uint16(nodePort))
	if err != nil {
		fmt.Println(err)
	} else {
		status = "Running"
		players := int(*res.Players.Online)
		maxPlayers := int(*res.Players.Max)
		latency := res.Latency.Milliseconds()
		version := res.Version.NameRaw
		fmt.Printf("Joueurs: %d/%d | Latency: %d | Status: %s | Version: %s\n", players, maxPlayers, latency, status, version)
	}

	fmt.Printf(`CPU: %dm | RAM: %dMi | CPU_MAX: %dm | RAM_MAX: %dMi | CPU_USAGE: %d%%| RAM_USAGE: %d%%| Address: %s`, cpu, mem, maxCpu, maxMem, cpuPercent, memPercent, address)
}
