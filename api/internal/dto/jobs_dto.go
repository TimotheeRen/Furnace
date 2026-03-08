package dto

type CronjobsDTO struct {
	Minute string `json:"minute"`
	Hour string `json:"hour"`
	Day string `json:"day"`
	Month string `json:"month"`
	Week string `json:"week"`
	Command string `json:"command"`
}

type NewCronjobsDTO struct {
	Server string `json:"server" query:"server"`
	Minute string `json:"minute" query:"minute"`
	Hour string `json:"hour" query:"hour"`
	Day string `json:"day" query:"day"`
	Month string `json:"month" query:"month"`
	Week string `json:"week" query:"week"`
	Command string `json:"command" query:"command"`
}
