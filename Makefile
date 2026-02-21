.PHONY: reset install

reset:
	k3d cluster delete Furnace
	k3d cluster create --config k3d/dev-env.yaml

install:
	helm upgrade --install furnace chart/ --wait

forward:
	kubectl port-forward svc/ui-service 8080:80
