#!/bin/bash

# Stop the script if any command fails
set -e

# Script Arguments
IMAGE_TAG=$1
BRANCH=$2
BASE_URL=$3
MONGO_USER=$4
MONGO_PWD=$5
BASE_DIR=$6

# Define and create the target directory
TARGET_DIR="$BASE_DIR/package-$BRANCH"

echo "🚀 Starting deployment in: $TARGET_DIR"

mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR" || exit 1

# --- 1. Dynamic Port Logic ---
# Assign a suggested port based on the branch name
if [ "$BRANCH" == "main" ]; then 
    SUGGESTED_PORT=3000
elif [ "$BRANCH" == "dev" ]; then 
    SUGGESTED_PORT=3001
else 
    SUGGESTED_PORT=3002 
fi

# Function to check if a specific port is available
is_port_free() {
  ! ss -tuln | grep -q ":$1 "
}

FINAL_PORT=$SUGGESTED_PORT
if ! is_port_free $FINAL_PORT; then
  echo "⚠️ Port $FINAL_PORT is busy. Searching for a free port..."
  # Scan range 3005-3999 for the first available port
  for port in {3005..3999}; do
    if is_port_free $port; then
      FINAL_PORT=$port
      break
    fi
  done
fi
echo "✅ Using Port: $FINAL_PORT"

# --- 2. URL and Database Formatting Logic ---
if [ "$BRANCH" == "main" ]; then
  DOMAIN="$BASE_URL"
  APP_URL="https://$BASE_URL"
  DB_NAME="worcable_prod"
else
  DOMAIN="$BRANCH.sandbox.$BASE_URL"
  APP_URL="https://$BRANCH.sandbox.$BASE_URL"
  DB_NAME="worcable_${BRANCH}_sandbox"
fi

# --- 3. NUXT_SECRET_KEY Management ---
# Reuse existing key if present, otherwise generate a new one
if [ -f "package.env" ] && grep -q "NUXT_SECRET_KEY=" package.env; then
  SECRET_KEY=$(grep "NUXT_SECRET_KEY=" package.env | cut -d'=' -f2-)
else
  SECRET_KEY=$(openssl rand -base64 48 | tr -d '\n')
fi

# --- 4. Configuration File Generation ---
# Create .env for Docker Compose
cat <<EOF > .env
IMAGE_TAG=$IMAGE_TAG
BRANCH_NAME=$BRANCH
HOST_PORT=$FINAL_PORT
DOMAIN=$DOMAIN
EOF

# Create package.env for the application container
cat <<EOF > package.env
PORT=$FINAL_PORT
NUXT_PUBLIC_APP_URL=$APP_URL
NUXT_DATABASE_URL="mongodb+srv://$MONGO_USER:$MONGO_PWD@cluster0.l1qnkbx.mongodb.net/$DB_NAME"
NUXT_SECRET_KEY=$SECRET_KEY
EOF

# --- 5. Deployment Execution ---
echo "📥 Pulling images..."
docker compose pull

echo "🆙 Starting containers..."
docker compose up -d --remove-orphans

echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✨ Deployment completed successfully on port $FINAL_PORT!"