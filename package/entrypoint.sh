#!/bin/bash

# Stop the script if any command fails
set -e

echo "-------------------------------------------------------"
echo "🚀 Worcable: Starting deployment process..."
echo "-------------------------------------------------------"

# 1. Environment check
echo "🔍 Checking Node environment..."
node -v
pnpm -v

# 2. Dependency installation
# We use --frozen-lockfile to ensure pnpm-lock.yaml integrity
echo "📦 Installing dependencies with pnpm..."
pnpm install --frozen-lockfile

# 3. Nuxt application build
# Environment variables injected into the container will be read here
echo "🏗️  Compiling Nuxt (This may take a moment)..."
pnpm build

# 4. Cleanup (Optional)
# You can uncomment the line below to remove devDependencies and save RAM
# pnpm prune --prod

# 5. Application launch
if [ -d ".output" ]; then
    echo "-------------------------------------------------------"
    echo "✅ Build completed successfully."
    echo "📡 Starting server on port ${PORT:-3000}..."
    echo "-------------------------------------------------------"
    
    # 'exec' allows Node to become the main process (PID 1)
    # This is crucial for Docker to handle stop signals (SIGTERM) properly
    exec node .output/server/index.mjs
else
    echo "❌ Error: Output directory .output not found."
    exit 1
fi