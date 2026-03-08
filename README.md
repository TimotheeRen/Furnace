# Furnace
A Kubernetes based Minecraft servers hosting solution.

![Dashboard screenshot](/website/public/dashboard_preview.png)

It provide a production ready Helm Chart, with every services ready to use. Furnace is design for hight availability on-premise servers, by providing an easy to use plateform that abstract all the complexity of Minecraft servers management.

# Architecture 🏗️
![Architecture scheme](/website/public/diagrams_image.png)

Furnace project contain the following microservices:

- The UI: A Nextjs web user interface, handle API calls in a reactive interface.
- The API: An Echo REST API that handle API calls from the front-end.
- The Message Broker: A redis service that serve both as a message broker and a metric storage.
- The Controller/Server: Handle redis messages and create the servers CRs, and monitor them. It runs with elevated cluster permissions and periodically scrap metrics from servers pods to store them in redis.
- The Kubernetes Operator: Watch and convert the created CRs into services and statefulsets and automatically reconsile CRs state.

# Installation 🚀
## Init the Cluster (with k3d)
```bash
	k3d cluster create --config k3d/dev-env.yaml
```
## Install the Helm Chart
```bash
	helm upgrade --install furnace chart/ --wait
```

## Port forward (if running the cluster localy)
```bash
	kubectl port-forward svc/ui-service 8080:80
```

# Features ✨

- [x] Servers creation
- [x] Metrics collection
- [x] A reactive console
- [x] An SFTP server for each pod (CI/CD compatibility)
- [x] Cronjobs
