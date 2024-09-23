locals {
  book_app_secrets = {
    DATABASE_HOST     = "fill_your_db_host"
    DATABASE_PORT     = 5432
    DATABASE_NAME     = "app"
    DATABASE_USERNAME = "fill_your_db_user_name"
    DATABASE_PASSWORD = "fill_your_db_password"
    REDIS_HOST        = "fill_your_redist_host"
    REDIS_PORT        = 6379
  }
}

resource "aws_secretsmanager_secret" "book_manager_secrets" {
  name        = "book-manager-secrets"
  description = "Secrets for the book manager application"
  recovery_window_in_days = 0
  lifecycle {
    ignore_changes = [name, description]
  }
}

resource "aws_secretsmanager_secret_version" "book_manager_secrets" {
  secret_id     = aws_secretsmanager_secret.book_manager_secrets.id
  secret_string = jsonencode(local.book_app_secrets)
}
