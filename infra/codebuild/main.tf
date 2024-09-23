locals {
  github_repository_url = "https://github.com/rust-web-app-book/rusty-book-manager.git"
}

resource "aws_codebuild_project" "database-migration" {
  name           = "book-mangaer-database-migration"
  build_timeout  = 10
  queued_timeout = 10

  service_role = var.book_app_service_role_arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  cache {
    type  = "LOCAL"
    modes = ["LOCAL_SOURCE_CACHE"]
  }

  environment {
    compute_type = "BUILD_GENERAL1_MEDIUM"
    # Ubuntu (https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-env-ref-available.html)
    image                       = "aws/codebuild/standard:7.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "DATABASE_HOST"
      type  = "SECRETS_MANAGER"
      value = "${var.book_app_secrets_manager_arn}:DATABASE_HOST::"
    }

    environment_variable {
      name  = "DATABASE_PORT"
      type  = "SECRETS_MANAGER"
      value = "${var.book_app_secrets_manager_arn}:DATABASE_PORT::"
    }

    environment_variable {
      name  = "DATABASE_NAME"
      type  = "SECRETS_MANAGER"
      value = "${var.book_app_secrets_manager_arn}:DATABASE_NAME::"
    }

    environment_variable {
      name  = "DATABASE_USERNAME"
      type  = "SECRETS_MANAGER"
      value = "${var.book_app_secrets_manager_arn}:DATABASE_USERNAME::"
    }

    environment_variable {
      name  = "DATABASE_PASSWORD"
      type  = "SECRETS_MANAGER"
      value = "${var.book_app_secrets_manager_arn}:DATABASE_PASSWORD::"
    }
  }

  source {
    type            = "GITHUB"
    location        = local.github_repository_url
    buildspec       = file("_codebuild/buildspec.yaml")
    git_clone_depth = 1
  }

  vpc_config {
    vpc_id             = var.book_app_vpc_id
    subnets            = var.book_app_codebuild_subnet_ids
    security_group_ids = [var.book_app_codebuild_security_group_id]
  }
}
