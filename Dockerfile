# --- Build Stage ---
FROM public.ecr.aws/lambda/nodejs:24 AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and configurations
COPY . .

# Build both server and client bundles (Vite outputs to /app/dist)
RUN npm run build

# --- Production Runner Stage ---
FROM public.ecr.aws/lambda/nodejs:24
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy production dependencies (or just the entire built node_modules)
COPY --from=builder /app/node_modules ./node_modules

# Copy the built server code AND the built static assets
COPY --from=builder /app/dist ./dist

# Point AWS Lambda to your entry handler
CMD ["dist/lambda.handler"]