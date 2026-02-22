package dto

type UserDTO struct {
	Username string `query:"username"`
	Password string `query:"password"`
}
