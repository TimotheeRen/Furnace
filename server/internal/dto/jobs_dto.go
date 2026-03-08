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
	Minute string `json:"minute"`
	Hour string `json:"hour"`
	Day string `json:"day"`
	Month string `json:"month"`
	Week string `json:"week"`
	Command string `json:"command"`
	Server string `json:"server"`
}
