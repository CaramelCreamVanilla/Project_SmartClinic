# Use a lightweight Node.js image
FROM node:alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install JSON Server
RUN npm install -g json-server

# Copy your JSON data file into the container
COPY blood_pressure.json .

# Expose port 5002 (or any other port you're using)
EXPOSE 5559

# Run JSON Server when the container starts
CMD ["json-server", "--watch", "blood_pressure.json", "--port", "5559"]
