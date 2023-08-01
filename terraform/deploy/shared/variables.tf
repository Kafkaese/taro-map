variable "resource_group_location" {
  default     = "germanywestcentral"
  description = "Location of the resource group."
}

variable "resource_group_name" {
  default     = "taro-test-env-frontend"
  description = "The resource group name."
}

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

variable "image_registry_login_server" {
  
}

variable "instance_name" {
}

variable "environment" {
  default = "test"
}