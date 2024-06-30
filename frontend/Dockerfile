# Use a Node.js LTS (Long Term Support) version as a base image
FROM node:16-alpine

# Set the working directory to /app/src inside the container
WORKDIR /app/src

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application
RUN npm run build

# Install serve to run the production build
RUN npm install -g serve

# Set the command to run the production build on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]

# Expose port 3000 to the outside world
EXPOSE 3000