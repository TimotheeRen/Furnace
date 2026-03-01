package jobs

import (
	"bufio"
	"context"
	"fmt"
	"io"

	"github.com/redis/go-redis/v9"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	metricsv "k8s.io/metrics/pkg/client/clientset/versioned"
)

func ConsoleStream(ctx context.Context, rdb *redis.Client, k8sClient kubernetes.Interface, metricsClient *metricsv.Clientset) {
	fmt.Println("Console Streaming...")

	podList, err := k8sClient.CoreV1().Pods("servers").List(ctx, metav1.ListOptions{})
	if err != nil {
		fmt.Println(err)
		return
	}

	for _, pod := range podList.Items {
		if len(pod.Spec.Containers) == 0 {
			continue
		}
		tailLines := int64(50)
		// now := metav1.Now()
		podLogOption := corev1.PodLogOptions{
			Container: pod.Spec.Containers[0].Name,
			Follow: true,
			TailLines: &tailLines,
			// SinceTime: &now,
		}

		req := k8sClient.CoreV1().Pods("servers").GetLogs(pod.Name, &podLogOption)
		stream, err := req.Stream(ctx)
		if err != nil {
			fmt.Println("Stream error: ", err)
		}
		go func(pName string, s io.ReadCloser) {
			if s == nil {
				return
			}
			defer s.Close()
			scanner := bufio.NewScanner(s)
			for scanner.Scan() {
				msg := scanner.Text()
				fmt.Printf("[%s] %s\n", pName, msg)
				rdb.Publish(ctx, "logs:"+pName, msg)
			}
		}(pod.Name, stream)
	}
}
