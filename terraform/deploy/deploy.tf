# Use shared resource module from taro-tf
module "shared-resources" {
  source = "git::https://github.com/Kafkaese/taro-tf//staging_env/shared_resource_module?ref=staging_branch"

  resource_group_name = var.resource_group_name
  resource_group_location = var.resource_group_location
  container_registry_name = var.acr_name
}

module "frontend" {
  sourcesource = "./shared"  
}