# resource group for all Azure resources
resource "azurerm_resource_group" "rg" {
  location = var.resource_group_location
  name     = var.resource_group_name
}

# Container registry for the frontend container
resource "azurerm_container_registry" "taro-test-registry" {
  name                = "taroFrontendTestContainerRegistry"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
}

# Container Instance for the Frontend
resource "azurerm_container_group" "taro-test-frontend-instance" {
  name                = var.instance_name
  location            = var.resource_group_location
  resource_group_name = var.resource_group_name
  ip_address_type     = "Public"
  os_type             = "Linux"

  image_registry_credential {
    username = var.image_registry_credential_user
    password = var.image_registry_credential_password
    server   = azurerm_container_registry.taro-test-registry.login_server
  }

  container {
    name   = "taro-frontend"
    image  = "${azurerm_container_registry.taro-test-registry.login_server}/taro:frontend"
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