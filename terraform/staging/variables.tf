variable "resource_group_location" {
  default     = "germanywestcentral"
  description = "Location of the resource group."
}

variable "resource_group_name" {
  default     = "taro-staging"
  description = "The resource group name."
}

variable "container_registry_name" {
  default = "tarostagingregistry"
}

variable "image_registry_credential_user" {
  default = "admin"
  sensitive = true
}

variable "image_registry_credential_password" {
  default = "secret"
  sensitive = true
}

variable "image_registry_login_server" {
  default = "tarostagingregistry.azurecr.io"
}

variable "instance_name" {
  default = "taro-staging-frontend"
}

variable "environment" {
  default = "staging"
}