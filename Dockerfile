# Stage 1: Build the Angular application
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the built application from stage 1
COPY --from=build /app/dist/drawing-app/browser /usr/share/nginx/html

# Create directory for certbot challenge
RUN mkdir -p /var/www/certbot

# Copy custom nginx configuration
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80
EXPOSE 443

# The ssl configuration will be mounted at runtime
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
