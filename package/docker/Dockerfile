FROM node:20-slim

# Enable corepack and prepare the latest version of pnpm
# RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g pnpm@10.23.0

# Set the working directory inside the container
WORKDIR /app

# Copy all project files to the working directory
COPY . .

# Ensure the entrypoint script has execution permissions
RUN chmod +x ./entrypoint.sh

# Define the single entry point for the container
ENTRYPOINT ["./entrypoint.sh"]