output "book_app_secrets_manager_arn" {
  value = aws_secretsmanager_secret.book_manager_secrets.arn
}
