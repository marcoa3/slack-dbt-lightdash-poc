resource "aws_api_gateway_rest_api" "example" {
  name        = "slack-dbt-lightdash-bot"
  description = "Hackathon POC for the query self serve slack bot"
}