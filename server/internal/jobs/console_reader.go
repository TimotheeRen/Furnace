package jobs

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"time"

	"github.com/redis/go-redis/v9"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	metricsv "k8s.io/metrics/pkg/client/clientset/versioned"
)

func ConsoleStream(ctx context.Context, rdb *redis.Client, k8sClient kubernetes.Interface, metricsClient *metricsv.Clientset) {
	activeStreams := make(map[string]bool)
	tailLines := int64(50)
	for {
		select {
		case <- ctx.Done():
			return
		default:
			fmt.Println("Console Streaming...")

			podList, _ := k8sClient.CoreV1().Pods("servers").List(ctx, metav1.ListOptions{})

			for _, pod := range podList.Items {
				if activeStreams[pod.Name] || pod.Status.Phase != corev1.PodRunning {
                    continue
                }

                activeStreams[pod.Name] = true 
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
						activeStreams[pName] = false
						return
					}
					defer func() {
						s.Close()
						activeStreams[pName] = false
						fmt.Printf("Stream stopped for pod %s\n", pName)
					}()
					scanner := bufio.NewScanner(s)
					for scanner.Scan() {
						msg := scanner.Text()
						fmt.Printf("[%s] %s\n", pName, msg)
						rdb.XAdd(ctx, &redis.XAddArgs{Stream: "logs:" + pName, MaxLen: 1000, Approx: true, Values: map[string]interface{}{"msg": msg}})
					}
				}(pod.Name, stream)
			}
			time.Sleep(10 * time.Second)
		}
	}
}
