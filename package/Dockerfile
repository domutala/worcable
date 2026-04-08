FROM node:20-slim

# Enable corepack and prepare the latest version of pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory inside the container
WORKDIR /app

# Copy all project files to the working directory
COPY . .

# Ensure the entrypoint script has execution permissions
RUN chmod +x ./entrypoint.sh

# Define the single entry point for the container
ENTRYPOINT ["./entrypoint.sh"]