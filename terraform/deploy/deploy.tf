provider "azurerm" {
  features {}
}

data "terraform_remote_state" "first_configuration" {
  backend = "azurerm"
  config = {
    storage_account_name = "taro"
    container_name       = "terraform-staging-env"
    key                  = "taging.tfstate"
  }
}

# Container registry for the frontend container
resource "azurerm_container_registry" "container-registry" {
  name                = var.acr_name
  resource_group_name = data.terraform_remote_state.first_configuration.outputs.rg-name
  location            = data.terraform_remote_state.first_configuration.outputs.rg-location
  sku                 = "Basic"
}

# Container Instance for the frontend
resource "azurerm_container_group" "container-instance" {
  name                = var.instance_name
  location            = data.terraform_remote_state.first_configuration.outputs.rg-location
  resource_group_name = var.resource_group_name
  ip_address_type     = "Public"
  os_type             = "Linux"

  image_registry_credential {
    username = var.image_registry_credential_user
    password = var.image_registry_credential_password
    server   = azurerm_container_registry.container-registry.login_server
  }

  container {
    name   = "taro-frontend"
    image  = "${azurerm_container_registry.container-registry.login_server}/taro:frontend"
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