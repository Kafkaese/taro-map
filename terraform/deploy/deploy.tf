# Use shared resource module from taro-tf
module "shared-resources" {
  source = "https://github.com/Kafkaese/taro-tf.git//staging/shared_resource_module?ref=staging"

  resource_group_name = var.resource_group_name
  resource_group_location = var.resource_group_location
  container_registry_name = var.acr_name
}

# Container Instance for the frontend
resource "azurerm_container_group" "container-instance" {
  name                = var.instance_name
  location            = module.shared-resources.rg-location
  resource_group_name = module.shared-resources.rg-name
  ip_address_type     = "Public"
  os_type             = "Linux"

  image_registry_credential {
    username = var.image_registry_credential_user
    password = var.image_registry_credential_password
    server   = module.shared-resources.acr-login
  }

  container {
    name   = "taro-frontend"
    image  = "${module.shared-resources.acr-login}/taro:frontend"
    cpu    = "0.5"
    memory = "1.5"
    environment_variables = {
      ENV=var.environment
    }

    ports {
      port     = 3000
      protocol = "TCP"
    }
  }

  tags = {
    environment = var.environment
  }
}