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

type ServerCommand struct {
	Server string `query:"server" json:"server"`
	Command string `query:"command" json:"command"`
}
