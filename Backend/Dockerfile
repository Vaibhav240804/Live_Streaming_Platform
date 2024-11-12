# Use node image as base
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy backend code
COPY . .

# Expose the app port
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]
