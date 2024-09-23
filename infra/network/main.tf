resource "aws_vpc" "book_app" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "book-app-vpc"
  }
}

resource "aws_subnet" "book_app_ingress_1a" {
  vpc_id            = aws_vpc.book_app.id
  cidr_block        = "10.0.0.0/24"
  availability_zone = var.az_a
  tags = {
    Name = "book-app-ingress-1a"
  }
}

resource "aws_subnet" "book_app_ingress_1c" {
  vpc_id            = aws_vpc.book_app.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = var.az_c
  tags = {
    Name = "book-app-ingress-1c"
  }
}

resource "aws_subnet" "book_app_container_1a" {
  vpc_id            = aws_vpc.book_app.id
  cidr_block        = "10.0.8.0/24"
  availability_zone = var.az_a
  tags = {
    Name = "book-app-container-1a"
  }
}

resource "aws_subnet" "book_app_container_1c" {
  vpc_id            = aws_vpc.book_app.id
  cidr_block        = "10.0.9.0/24"
  availability_zone = var.az_c
  tags = {
    Name = "book-app-container-1c"
  }
}

resource "aws_subnet" "book_app_db_1a" {
  vpc_id            = aws_vpc.book_app.id
  cidr_block        = "10.0.16.0/24"
  availability_zone = var.az_a
  tags = {
    Name = "book-app-db-1a"
  }
}

resource "aws_subnet" "book_app_db_1c" {
  vpc_id            = aws_vpc.book_app.id
  cidr_block        = "10.0.17.0/24"
  availability_zone = var.az_c
  tags = {
    Name = "book-app-db-1c"
  }
}

resource "aws_db_subnet_group" "book_app" {
  name = "book-app-db"
  subnet_ids = [
    aws_subnet.book_app_db_1a.id,
    aws_subnet.book_app_db_1c.id
  ]
}

resource "aws_elasticache_subnet_group" "book_app_redis" {
  name = "book-app-redis"
  subnet_ids = [
    aws_subnet.book_app_container_1a.id,
    aws_subnet.book_app_container_1c.id
  ]
}

resource "aws_internet_gateway" "book_app" {
  vpc_id = aws_vpc.book_app.id
  tags = {
    Name = "book-app-igw"
  }
}

resource "aws_route_table" "book_app_public" {
  vpc_id = aws_vpc.book_app.id
  tags = {
    Name = "book-app-public"
  }
}

resource "aws_route" "book_app_public" {
  destination_cidr_block = "0.0.0.0/0"
  route_table_id         = aws_route_table.book_app_public.id
  gateway_id             = aws_internet_gateway.book_app.id
}

resource "aws_route_table_association" "book_app_public_1a" {
  subnet_id      = aws_subnet.book_app_ingress_1a.id
  route_table_id = aws_route_table.book_app_public.id
}

resource "aws_route_table_association" "book_app_public_1c" {
  subnet_id      = aws_subnet.book_app_ingress_1c.id
  route_table_id = aws_route_table.book_app_public.id
}

resource "aws_route_table" "book_app_private_1a" {
  vpc_id = aws_vpc.book_app.id
  tags = {
    Name = "book-app-private-1a"
  }
}

resource "aws_route" "book_app_private_1a" {
  destination_cidr_block = "0.0.0.0/0"
  route_table_id         = aws_route_table.book_app_private_1a.id
  gateway_id             = aws_nat_gateway.nat_1a.id
}

resource "aws_route_table_association" "book_app_private_1a" {
  subnet_id      = aws_subnet.book_app_private_1a.id
  route_table_id = aws_route_table.book_app_private_1a.id
}

resource "aws_route_table" "book_app_private_1c" {
  vpc_id = aws_vpc.book_app.id
  tags = {
    Name = "book-app-private-1c"
  }
}

resource "aws_route" "book_app_private_1c" {
  destination_cidr_block = "0.0.0.0/0"
  route_table_id         = aws_route_table.book_app_private_1c.id
  gateway_id             = aws_nat_gateway.nat_1c.id
}

resource "aws_route_table_association" "book_app_private_1c" {
  subnet_id      = aws_subnet.book_app_private_1c.id
  route_table_id = aws_route_table.book_app_private_1c.id
}

resource "aws_eip" "nat_1a" {
  domain = "vpc"
  tags = {
    Name = "book-app-natgw-1a"
  }
}

resource "aws_nat_gateway" "nat_1a" {
  subnet_id     = aws_subnet.book_app_ingress_1a.id
  allocation_id = aws_eip.nat_1a.id
  tags = {
    Name = "book-app-1a"
  }
}
resource "aws_eip" "nat_1c" {
  domain = "vpc"
  tags = {
    Name = "book-app-natgw-1c"
  }
}

resource "aws_nat_gateway" "nat_1c" {
  subnet_id     = aws_subnet.book_app_ingress_1c.id
  allocation_id = aws_eip.nat_1c.id
  tags = {
    Name = "book-app-1c"
  }
}

resource "aws_security_group" "book_app_frontend" {
  name        = "book-app-frontend"
  description = "A security group for the frontend"
  vpc_id      = aws_vpc.book_app.id
  tags = {
    Name = "book-app-frontend"
  }
}

resource "aws_vpc_security_group_ingress_rule" "book_app_frontend" {
  security_group_id = aws_security_group.book_app_frontend.id
  cidr_ipv4         = aws_vpc.book_app.cidr_block
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "book_app_frontend" {
  security_group_id = aws_security_group.book_app_frontend.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_security_group" "book_app_backend" {
  name        = "book-app-backend"
  description = "A security group for the backend"
  vpc_id      = aws_vpc.book_app.id
  tags = {
    Name = "book-app-backend"
  }
}

resource "aws_vpc_security_group_ingress_rule" "book_app_backend" {
  security_group_id = aws_security_group.book_app_backend.id
  cidr_ipv4         = aws_vpc.book_app.cidr_block
  from_port         = 8080
  to_port           = 8080
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "book_app_backend" {
  security_group_id = aws_security_group.book_app_backend.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_security_group" "book_app_db" {
  name        = "book-app-db"
  description = "A security group to connect the database"
  vpc_id      = aws_vpc.book_app.id
  tags = {
    Name = "book-app-db"
  }
}

resource "aws_vpc_security_group_ingress_rule" "book_app_db" {
  security_group_id = aws_security_group.book_app_db.id
  cidr_ipv4         = aws_vpc.book_app.cidr_block
  from_port         = 5432
  to_port           = 5432
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "book_app_db_codebuild" {
  security_group_id            = aws_security_group.book_app_db.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
  referenced_security_group_id = aws_security_group.book_app_codebuild.id
}

resource "aws_vpc_security_group_egress_rule" "book_app_db" {
  security_group_id = aws_security_group.book_app_db.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_security_group" "book_app_redis" {
  name        = "book-app-redis"
  description = "A security group to connect redis"
  vpc_id      = aws_vpc.book_app.id
  tags = {
    Name = "book-app-redis"
  }
}

resource "aws_vpc_security_group_ingress_rule" "book_app_redis" {
  security_group_id = aws_security_group.book_app_redis.id
  cidr_ipv4         = aws_vpc.book_app.cidr_block
  from_port         = 6379
  to_port           = 6379
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "book_app_redis" {
  security_group_id = aws_security_group.book_app_redis.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}


resource "aws_security_group" "book_app_vpc_connector" {
  name        = "book-app-vpc-connector"
  description = "A security group to connect the database with VPC connector"
  vpc_id      = aws_vpc.book_app.id
  tags = {
    Name = "book-app-vpc-connector"
  }
}

resource "aws_vpc_security_group_egress_rule" "book_app_vpc_connector" {
  security_group_id = aws_security_group.book_app_vpc_connector.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_subnet" "book_app_private_1a" {
  vpc_id            = aws_vpc.book_app.id
  cidr_block        = "10.0.18.0/24"
  availability_zone = var.az_a
  tags = {
    Name = "book-app-private-1a"
  }
}

resource "aws_subnet" "book_app_private_1c" {
  vpc_id            = aws_vpc.book_app.id
  cidr_block        = "10.0.19.0/24"
  availability_zone = var.az_c
  tags = {
    Name = "book-app-private-1c"
  }
}

resource "aws_eip" "book_app_private_nat_1a" {
  domain = "vpc"
  tags = {
    Name = "book-app-private-1a"
  }
}

resource "aws_nat_gateway" "book_app_private_nat_1a" {
  subnet_id     = aws_subnet.book_app_private_1a.id
  allocation_id = aws_eip.book_app_private_nat_1a.id
  tags = {
    Name = "book-app-private-1a"
  }
}

resource "aws_eip" "book_app_private_nat_1c" {
  domain = "vpc"
  tags = {
    Name = "book-app-private-1c"
  }
}

resource "aws_nat_gateway" "book_app_private_nat_1c" {
  subnet_id     = aws_subnet.book_app_private_1c.id
  allocation_id = aws_eip.book_app_private_nat_1c.id
  tags = {
    Name = "book-app-private-1c"
  }
}

resource "aws_security_group" "book_app_codebuild" {
  name        = "book-app-codebuild"
  description = "A security group to connect the database"
  vpc_id      = aws_vpc.book_app.id
  tags = {
    Name = "book-app-codebuild"
  }
}

resource "aws_vpc_security_group_ingress_rule" "book_codebuild" {
  security_group_id = aws_security_group.book_app_codebuild.id
  cidr_ipv4         = aws_vpc.book_app.cidr_block
  from_port         = 0
  to_port           = 65535
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "book_codebuild" {
  security_group_id = aws_security_group.book_app_codebuild.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

