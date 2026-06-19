variable "image_tag" {
  type        = string
  description = "The Docker image tag to deploy"
}

variable "database_url" {
  type        = string
  description = "The connection string for the PostgreSQL database"
  sensitive   = true
}
