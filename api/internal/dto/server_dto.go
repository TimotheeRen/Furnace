package dto

type ServerDTO struct {
	ServerName string `query:"serverName"`
	ServerType string `query:"serverType"`
	ServerVersion string `query:"serverVersion"`
	MinRam string `query:"minRam"`
	MinCpu string `query:"minCpu"`
	MaxRam string `query:"maxRam"`
	MaxCpu string `query:"maxCpu"`
	Storage string `query:"storage"`
}
