# --- Build Stage ---
FROM public.ecr.aws/lambda/nodejs:24 AS builder
WORKDIR /app

# Install all dependencies (including devDependencies needed to build)
COPY package*.json ./
RUN npm ci

# Copy source and configurations
COPY . .

# Build both server and client bundles (Vite outputs to /app/dist)
RUN npm run build

# --- Production Runner Stage ---
FROM public.ecr.aws/lambda/nodejs:24
WORKDIR ${LAMBDA_TASK_ROOT}

COPY package*.json ./

# Add --ignore-scripts to skip the husky prepare hook
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/dist/ ./

CMD ["lambda.handler"]