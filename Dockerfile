# Development stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 5173 (Vite's default port)
EXPOSE 8080

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
