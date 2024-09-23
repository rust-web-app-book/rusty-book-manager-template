resource "aws_iam_role" "apprunner_instance_role" {
  name = "apprunner-instance-role"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "tasks.apprunner.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })

  inline_policy {
    name = "apprunner-instance-policy"
    policy = jsonencode({
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Effect" : "Allow",
          "Action" : [
            "secretsmanager:GetSecretValue",
            "secretsmanager:DescribeSecret"
          ],
          "Resource" : "*"
        }
      ]
    })
  }

  tags = {
    Name = "apprunner-instance-role"
  }
}

data "aws_iam_policy_document" "apprunner_assumerole" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["build.apprunner.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "apprunner_ecr_book_app" {
  name               = "apprunner-ecr-access-role"
  assume_role_policy = data.aws_iam_policy_document.apprunner_assumerole.json
}

data "aws_iam_policy_document" "apprunner_ecr_policy" {
  statement {
    effect = "Allow"
    actions = [
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:DescribeImages",
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability"
    ]

    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "apprunner_ecr_book_app" {
  name   = "apprunner-ecr-access-policy"
  role   = aws_iam_role.apprunner_ecr_book_app.name
  policy = data.aws_iam_policy_document.apprunner_ecr_policy.json
}


# Codebuild

data "aws_iam_policy_document" "codebuild_assumerole" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["codebuild.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "codebuild_book_app" {
  name               = "codebuild-book-app-assume"
  assume_role_policy = data.aws_iam_policy_document.codebuild_assumerole.json
}

data "aws_iam_policy_document" "codebuild_book_app" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["*"]
  }

  statement {
    effect = "Allow"

    actions = [
      "ec2:CreateNetworkInterface",
      "ec2:DescribeDhcpOptions",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface",
      "ec2:DescribeSubnets",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeVpcs",
      "secretsmanager:GetSecretValue",
    ]

    resources = ["*"]
  }

  statement {
    effect  = "Allow"
    actions = ["ec2:CreateNetworkInterfacePermission"]
    resources = ["arn:aws:ec2:ap-northeast-1:*:network-interface/*"]

    condition {
      test     = "StringEquals"
      variable = "ec2:Subnet"

      values = var.book_app_private_subnet_arns
    }

    condition {
      test     = "StringEquals"
      variable = "ec2:AuthorizedService"
      values   = ["codebuild.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy" "book_app" {
  role   = aws_iam_role.codebuild_book_app.name
  policy = data.aws_iam_policy_document.codebuild_book_app.json
}
