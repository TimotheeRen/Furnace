package dto

type ServerDTO struct {
	ServerName string `query:"server-name"`
	ServerType string `query:"server-type"`
	ServerVersion string `query:"server-version"`
	MinRam string `query:"min-ram"`
	MinCpu string `query:"min-cpu"`
	MaxRam string `query:"max-ram"`
	MaxCpu string `query:"max-cpu"`
	Storage string `query:"storage"`
}
