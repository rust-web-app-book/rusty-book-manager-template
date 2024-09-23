output "book_app_vpc_id" {
  value = aws_vpc.book_app.id
}

output "book_app_db_subnet_ids" {
  value = [
    aws_subnet.book_app_db_1a.id,
    aws_subnet.book_app_db_1c.id
  ]
}

output "book_app_db_subnet_arns" {
  value = [
    aws_subnet.book_app_db_1a.arn,
    aws_subnet.book_app_db_1c.arn
  ]
}

output "book_app_private_subnet_arns" {
  value = [
    aws_subnet.book_app_private_1a.arn,
    aws_subnet.book_app_private_1c.arn
  ]
}

output "book_app_private_subnet_ids" {
  value = [
    aws_subnet.book_app_private_1a.id,
    aws_subnet.book_app_private_1c.id
  ]
}

output "book_app_db_subnet_group_name" {
  value = aws_db_subnet_group.book_app.name
}

output "book_app_db_security_group_id" {
  value = aws_security_group.book_app_db.id
}

output "book_app_redis_security_group_id" {
  value = aws_security_group.book_app_redis.id
}

output "book_app_vpc_connector_security_group_id" {
  value = aws_security_group.book_app_vpc_connector.id
}

output "book_app_redis_subnet_group_name" {
  value = aws_elasticache_subnet_group.book_app_redis.name
}

output "book_app_codebuild_security_group_id" {
  value = aws_security_group.book_app_codebuild.id
}
