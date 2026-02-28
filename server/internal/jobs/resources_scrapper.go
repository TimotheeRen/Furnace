package jobs

import (
	"context"
	"fmt"

	"github.com/mcstatus-io/mcutil"
	"github.com/redis/go-redis/v9"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	metricsv "k8s.io/metrics/pkg/client/clientset/versioned"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

func GetResources(ctx context.Context, rdb *redis.Client, k8sClient client.Client, metricsClient *metricsv.Clientset) {
	fmt.Println("Scrapping...")

	podList := &corev1.PodList{}
	listOpts := []client.ListOption{
		client.InNamespace("servers"),
	}

	if err := k8sClient.List(ctx, podList, listOpts...); err != nil {
		fmt.Println(err)
	}

	if len(podList.Items) == 0 {
		return
	}

	for _, pod := range podList.Items {
		if len(pod.Spec.Containers) == 0 {
			continue
		}
		podContainer := pod.Spec.Containers[0]
		maxMem := podContainer.Resources.Limits.Memory().Value() / (1024 * 1024)
		maxCpu := podContainer.Resources.Limits.Cpu().MilliValue()

		podMetrics, err := metricsClient.MetricsV1beta1().PodMetricses("servers").Get(context.TODO(), pod.Name, metav1.GetOptions{})
		if err != nil {
			fmt.Println(err)
		}

		if len(podMetrics.Containers) == 0 {
			continue
		}
		container := podMetrics.Containers[0]
		cpu := container.Usage.Cpu().MilliValue()
		mem := container.Usage.Memory().Value() / (1024 * 1024)

		memPercent := int((float64(mem) / float64(maxMem)) * 100)
		cpuPercent := int((float64(cpu) / float64(maxCpu)) * 100)

		host := pod.Status.PodIP
		if host == "" {
			fmt.Println("The pod as no IP")
			continue
		}
		status, error := mcutil.Status(host, 25565)
		var players int64
		var maxPlayers int64
		var playersPercent int
		if error == nil {
			players = *status.Players.Online
			maxPlayers = *status.Players.Max
			playersPercent = int(float64(players) / float64(maxPlayers) * 100)
		} else {
			fmt.Printf("Minecraft server is down: %v\n", error)
			continue
		}

		fmt.Printf("RAM: %d%% | CPU: %d%% | Players: %d\n", memPercent, cpuPercent, playersPercent)
	}
}
