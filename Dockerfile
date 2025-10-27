# Multi-stage build for optimized production image

# Stage 1: Build
FROM node:20-alpine AS builder

# Устанавливаем yarn
RUN apk add --no-cache yarn

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Генерируем SvelteKit конфигурацию
RUN npx svelte-kit sync

# Build arguments for VITE environment variables
ARG VITE_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
ARG VITE_APP_ENV=production
ARG VITE_APP_URL=http://localhost:5173
ARG VITE_DEBUG=false

# Set environment variables for build
ENV VITE_GRAPHQL_ENDPOINT=${VITE_GRAPHQL_ENDPOINT}
ENV VITE_APP_ENV=${VITE_APP_ENV}
ENV VITE_APP_URL=${VITE_APP_URL}
ENV VITE_DEBUG=${VITE_DEBUG}

# Build the application
RUN yarn build

# Stage 2: Production
FROM node:20-alpine

# Устанавливаем yarn
RUN apk add --no-cache yarn

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))" || exit 1

# Start the application
CMD ["node", "build"]
