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

# Copy production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the built server code AND the built static assets
COPY --from=builder /app/dist ./dist

# Point AWS Lambda to your entry handler
CMD ["dist/index.handler"]