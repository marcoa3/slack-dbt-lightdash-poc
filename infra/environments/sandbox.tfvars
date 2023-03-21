environment = "sandbox"
owner       = "beautypie"
region      = "eu-west-2"

tags = {
  Owner       = "BeautyPie"
  Environment = "Sandbox"
  ManagedBy   = "Terraform"
}

apex_zone = "beautypie-sandbox.com"

main_ecs_cluster = {
  name               = "main-sandbox"
  container_insights = true
}

datadog_account_id = "d29da78245c04ac7b687e71c626ad6e1"
