# Base Node image
FROM node:20-alpine as base

# Set working directory
WORKDIR /app

# Install dependencies
FROM base as deps
# Set up npm to use GitHub packages
ARG NODE_AUTH_TOKEN
RUN npm config set @seenelm:registry https://npm.pkg.github.com/
RUN npm config set //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
COPY package.json package-lock.json ./
# Install dependencies (including dev dependencies for testing)
RUN npm ci

# Build the application
FROM deps as builder
COPY . .
RUN npx msw init public/ --save
RUN npm run build

# Test stage
FROM deps as test
COPY . .
RUN npx msw init public/ --save
# Run unit tests
CMD ["npm", "run", "test:coverage"]

# E2E test stage
FROM deps as e2e
COPY . .
RUN npx msw init public/ --save
# Install Playwright dependencies
RUN npx playwright install --with-deps chromium
# Run E2E tests
CMD ["npm", "run", "test:e2e"]

# Production stage
FROM base as production
COPY --from=builder /app/dist /app/dist
# Add a simple server to serve the static files if needed
RUN npm install -g serve
CMD ["serve", "-s", "dist"]
