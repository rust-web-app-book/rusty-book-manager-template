variable "book_app_vpc_id" {
  type = string
}

variable "book_app_db_subnet_ids" {
  type = list(string)
}

variable "book_app_vpc_connector_sg_id" {
  type = string
}

variable "book_app_secrets_manager_arn" {
  type = string
}

variable "apprunner_instance_role_arn" {
  type = string
}

variable "apprunner_ecr_access_role_arn" {
  type = string
}

