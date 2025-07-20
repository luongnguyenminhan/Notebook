# Dockerfile for SercueScribe Frontend (Next.js + Bun)
# Lightweight, production-ready, removes build-time cruft

FROM node:20 AS base
WORKDIR /app

# Copy only package manager files first for caching
COPY package.json yarn.lock ./

# Install dependencies (production only)
RUN yarn install --frozen-lockfile --production

# Copy only necessary frontend source files
COPY . .

# Build Next.js app
RUN yarn build

# Expose Next.js port
EXPOSE 3000

# Start Next.js app
CMD ["yarn", "start"]
