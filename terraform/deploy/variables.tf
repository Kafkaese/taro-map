
variable "acr_name" {
  default = "taroFrontendTestContainerRegistry"
  description = "Name of the container registry"
}

variable "image_registry_credential_user" {
  default = "user"
}

variable "image_registry_credential_password" {
  default = "secret"
}

variable "instance_name" {
}

variable "environment" {
  default = "test"
}