package dto

type ServerDTO struct {
	ServerName string `json:"serverName"`
	ServerType string `json:"serverType"`
	ServerVersion string `json:"serverVersion"`
	MinRam string `json:"minRam"`
	MinCpu string `json:"minCpu"`
	MaxRam string `json:"maxRam"`
	MaxCpu string `json:"maxCpu"`
	Storage string `json:"storage"`
}
