# --- Build Stage ---
FROM public.ecr.aws/lambda/nodejs:24 AS builder
WORKDIR /app

# Install all dependencies (including devDependencies needed for build)
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# --- Production Runner Stage ---
FROM public.ecr.aws/lambda/nodejs:24
WORKDIR ${LAMBDA_TASK_ROOT}

# Prevent lifecycle tools like Husky from running in CI/Docker
ENV HUSKY=0

# Copy package configurations
COPY package*.json ./

# Install ONLY production dependencies in the AWS Lambda Linux environment
# (This downloads the correct Linux x64/arm64 native binary for @node-rs/argon2)
RUN npm ci --omit=dev

# Copy built application output directly into AWS Lambda task root
COPY --from=builder /app/dist/ ./

# Point AWS Lambda directly to handler
CMD ["lambda.handler"]