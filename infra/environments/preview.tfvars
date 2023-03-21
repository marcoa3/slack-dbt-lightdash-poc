environment = "preview"
owner       = "beautypie"
region      = "eu-west-2"

tags = {
  Owner       = "BeautyPie"
  Environment = "preview"
  ManagedBy   = "Terraform"
}

apex_zone = "beautypie-preview.com"

main_ecs_cluster = {
  name               = "main-preview"
  container_insights = true
}

datadog_account_id = "4bf079faa6804880b5028c2aefc253c1"
