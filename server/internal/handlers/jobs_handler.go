package handlers

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"server/internal/dto"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/remotecommand"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

func GetCronjobs(ctx context.Context, rdb *redis.Client, client client.Client, payload string, k8sClient kubernetes.Interface, config *rest.Config) {
    podName := payload + "-0"
    
    command := []string{"crontab", "-l"}

    req := k8sClient.CoreV1().RESTClient().Post().
        Resource("pods").
        Namespace("servers").
        Name(podName).
        SubResource("exec").
        Param("container", "server-container").
        Param("stdout", "true").
        Param("stderr", "true").
        Param("stdin", "false").
        Param("tty", "false")

    for _, c := range command {
        req.Param("command", c)
    }

    exec, err := remotecommand.NewSPDYExecutor(config, "POST", req.URL())
    if err != nil { return }
    
    var stdout, stderr bytes.Buffer
    err = exec.StreamWithContext(ctx, remotecommand.StreamOptions{
        Stdout: &stdout,
        Stderr: &stderr,
    })
    
    if err != nil {
        fmt.Printf("Erreur: %v | Stderr: %s\n", err, stderr.String())
        return
    }

	var jobs []dto.CronjobsDTO
	output := stdout.String()
	scanner := bufio.NewScanner(strings.NewReader(output))
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if strings.Contains(line, "run-parts") {
			parts := strings.Fields(line)
			if len(parts) >= 6 {
				job := dto.CronjobsDTO{
					Minute:  parts[0],
					Hour:    parts[1],
					Day:     parts[2],
					Month:   parts[3],
					Week:    parts[4],
					Command: strings.Join(parts[5:], " "),
				}
				jobs = append(jobs, job)
			}
		}
	}
    fmt.Println("Cronjobs:", jobs)

	serverDTOjson, err := json.Marshal(jobs)
	if err != nil {
		fmt.Println(err)
	}
	rdb.LPush(ctx, "getCronjobsResponse", serverDTOjson)
	rdb.Expire(ctx, "getCronjobsResponse", 3*time.Second)
}
