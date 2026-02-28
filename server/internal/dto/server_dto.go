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

type ServerStat struct {
	ServerName string `json:"serverName"`
	ServerType string `json:"serverType"`
	ServerStatus string `json:"serverStatus"`
}

type ServerInfo struct {
	ServerReady bool `json:"serverReady"`
	ServerCPU int64 `json:"serverCPU"`
	ServerRAM int64 `json:"serverRAM"`
	ServerMaxCPU int64 `json:"serverMaxCPU"`
	ServerMaxRam int64 `json:"serverMaxRam"`
	ServerCPUUsage int `json:"serverCPUUsage"`
	ServerRAMUsage int `json:"serverRAMUsage"`
	ServerAddress string `json:"serverAddress"`
	ServerPlayers int `json:"serverPlayers"`
	ServerMaxPlayers int `json:"serverMaxPlayers"`
	ServerLatency int `json:"serverLatency"`
	ServerStatus string `json:"serverStatus"`
	ServerVersion string `json:"serverVersion"`
}

type ServerMetric struct {
	Time string `json:"time"`
	Cpu int `json:"cpu"`
	Ram int `json:"ram"`
	Players int `json:"players"`
}
