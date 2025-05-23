# Simple single-stage Dockerfile for Railway
FROM node:20-alpine

WORKDIR /app

# Copy everything from services/api
COPY services/api/package*.json ./
COPY services/api/prisma ./prisma/

# Install all dependencies (including dev for Prisma CLI)
RUN npm install

# Copy source code
COPY services/api/. .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Run migrations and start the application
CMD npx prisma migrate deploy && npm run start:prod
