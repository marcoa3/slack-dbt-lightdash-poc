environment = "production"
owner       = "beautypie"
region      = "eu-west-2"

tags = {
  Owner       = "BeautyPie"
  Environment = "production"
  ManagedBy   = "Terraform"
}

apex_zone = "beautypie.com"

main_ecs_cluster = {
  name               = "main-production"
  container_insights = true
}

datadog_account_id = "ed0882dd118a4f8598b86accb0673a7b"

db_instance_type = "db.r6g.xlarge"
