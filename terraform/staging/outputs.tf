output "public-ip" {
  value = azurerm_container_group.container-instance.ip_address
}

output "port" {
  value = azurerm_container_group.container-instance.exposed_port
}