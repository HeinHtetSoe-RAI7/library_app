# Build Stage
FROM node:20-alpine as builder

WORKDIR /src

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy all necessary files
COPY . .

# API_URL for building
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Next.js
RUN npm run build

# Production Stage (lighter image)
FROM node:20-alpine

WORKDIR /src

# Copy from builder stage
COPY --from=builder /src /src

# Expose port 3000
EXPOSE 3000

# Disable telemetry
RUN npx next telemetry disable

# Command for development
# CMD ["npm", "run", "dev"]

# Optional: use for production
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
