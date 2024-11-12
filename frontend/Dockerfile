# Use node image as base
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application files
COPY . .

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]