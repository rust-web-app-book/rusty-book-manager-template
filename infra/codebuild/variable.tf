variable "book_app_secrets_manager_arn" {
  type = string
}

variable "book_app_vpc_id" {
  type = string
}

variable "book_app_codebuild_subnet_ids" {
  type = list(string)
}

variable "book_app_db_security_group_id" {
  type = string
}

variable "book_app_codebuild_security_group_id" {
  type = string
}

variable "book_app_service_role_arn" {
  type = string
}
