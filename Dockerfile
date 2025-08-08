# Dockerfile for LEGACY XMD WhatsApp Bot
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Create necessary directories
RUN mkdir -p session downloads temp

# Set permissions
RUN chmod +x index.js

# Expose port (if needed for health checks)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Run the bot
CMD ["node", "index.js"]