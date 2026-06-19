terraform {
  required_version = ">= 1.5.0"

  backend "s3" {
    bucket = "a12p-wh-tfstate-bucket"
    key    = "a12p-wh-api/terraform.tfstate"
    region = "eu-west-2"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-west-2"
}
