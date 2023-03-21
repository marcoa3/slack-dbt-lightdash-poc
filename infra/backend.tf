terraform {
  backend "s3" {
    encrypt        = true
    region         = "eu-west-2"
    key            = "$PLEASE_CHANGE"
    dynamodb_table = "terraform-state-lock"
  }
}
