# Stage 1: Build
FROM node:22 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Build the TypeScript files
RUN npm run build

# Stage 2: Production
FROM node:22-slim

WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

RUN npm install --only=production

EXPOSE 3001

# Start the application
CMD ["node", "dist/index.js"]