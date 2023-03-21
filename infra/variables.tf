variable "environment" {}
variable "owner" {}
variable "region" {}

variable "tags" {
  type = object({
    Owner       = string
    Environment = string
    ManagedBy   = string
  })
}
