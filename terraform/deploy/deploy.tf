# Use shared resource module from taro-tf
module "shared-resources" {
  source = "git::https://github.com/Kafkaese/taro-tf//staging_env/shared_resource_module?ref=staging_branch"
}

module "frontend" {
  source = "./shared"  

  resource_group_location = module.shared-resource.rg-location
  resource_group_name = module.shared-resource.rg-name
  acr_name = module.shared-resource.acr
  image_registry_login_server = module.shared-resource.acr-login
  image_registry_credential_user = module.shared-resource.acr-user
  image_registry_credential_password = module.shared-resource.acr-password
  instance_name = var.instance_name
  environment = var.environment
}