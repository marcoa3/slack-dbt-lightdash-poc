terraform {
  backend "s3" {
    encrypt        = true
    region         = "eu-west-2"
    key            = "slack-dbt-lightdash-poc"
    dynamodb_table = "terraform-state-lock"
  }
}
