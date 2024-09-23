resource "aws_rds_cluster" "book_app_db" {
  cluster_identifier     = "book-app-db"
  engine                 = "aurora-postgresql"
  engine_mode            = "provisioned"
  engine_version         = "15.4"
  db_subnet_group_name   = var.book_app_db_subnet_group_name
  vpc_security_group_ids = [var.book_app_db_security_group_id, var.book_app_vpc_connector_security_group_id]
  skip_final_snapshot    = true

  database_name               = "app"
  master_username             = "app"
  manage_master_user_password = true

  serverlessv2_scaling_configuration {
    min_capacity = 0.5
    max_capacity = 1.0
  }
}

resource "aws_rds_cluster_instance" "book_app_db" {
  identifier           = "book-app-db-instance"
  cluster_identifier   = aws_rds_cluster.book_app_db.id
  engine               = aws_rds_cluster.book_app_db.engine
  engine_version       = aws_rds_cluster.book_app_db.engine_version
  instance_class       = "db.serverless"
  db_subnet_group_name = var.book_app_db_subnet_group_name
}

resource "aws_elasticache_cluster" "book_app_redis" {
  cluster_id         = "book-app-redis"
  engine             = "redis"
  node_type          = "cache.t3.micro"
  num_cache_nodes    = 1
  port               = 6379
  apply_immediately  = true
  subnet_group_name  = var.book_app_redis_subnet_group_name
  security_group_ids = [var.book_app_redis_security_group_id]
}
