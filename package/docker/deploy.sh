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

# Function to check if a specific port is available on the host
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
# Logic: If package.env exists and contains the URL, reuse it. Otherwise, generate based on branch.
if [ -f "package.env" ] && grep -q "NUXT_PUBLIC_APP_URL=" package.env; then
  APP_URL=$(grep "NUXT_PUBLIC_APP_URL=" package.env | cut -d'=' -f2-)
  # Extract domain from URL (removes protocol and trailing slashes)
  DOMAIN=$(echo "$APP_URL" | sed -e 's|^[^/]*//||' -e 's|/.*$||')
else
  if [ "$BRANCH" == "main" ]; then
    DOMAIN="$BASE_URL"
    APP_URL="https://$BASE_URL"
    DB_NAME="worcable_prod"
  else
    DOMAIN="$BRANCH.sandbox.$BASE_URL"
    APP_URL="https://$BRANCH.sandbox.$BASE_URL"
    DB_NAME="worcable_${BRANCH}_sandbox"
  fi
fi

# --- 3. Persistence Management (Secret Key & DB URL) ---
# Reuse existing NUXT_SECRET_KEY if present, otherwise generate a new one
if [ -f "package.env" ] && grep -q "NUXT_SECRET_KEY=" package.env; then
  SECRET_KEY=$(grep "NUXT_SECRET_KEY=" package.env | cut -d'=' -f2-)
else
  SECRET_KEY=$(openssl rand -base64 48 | tr -d '\n')
fi

# Reuse existing DATABASE_URL if present, otherwise construct it
if [ -f "package.env" ] && grep -q "NUXT_DATABASE_URL=" package.env; then
  DATABASE_URL=$(grep "NUXT_DATABASE_URL=" package.env | cut -d'=' -f2-)
else
  DATABASE_URL="mongodb+srv://$MONGO_USER:$MONGO_PWD@cluster0.l1qnkbx.mongodb.net/$DB_NAME"
fi

# --- 4. Configuration File Generation ---
# Create/Overwrite .env for Docker Compose
cat <<EOF > .env
IMAGE_TAG=$IMAGE_TAG
BRANCH_NAME=$BRANCH
HOST_PORT=$FINAL_PORT
DOMAIN=$DOMAIN
EOF

# Create/Overwrite package.env for the application container
cat <<EOF > package.env
PORT=$FINAL_PORT
NUXT_PUBLIC_APP_URL=$APP_URL
NUXT_DATABASE_URL=$DATABASE_URL
NUXT_SECRET_KEY=$SECRET_KEY
EOF

docker network inspect traefik-public >/dev/null 2>&1 || \
docker network create traefik-public

# --- 5. Deployment Execution ---
echo "📥 Pulling latest images..."
docker compose pull

echo "🆙 Starting containers..."
docker compose up -d --remove-orphans

echo "🧹 Cleaning up unused Docker images..."
docker image prune -f

echo "✨ Deployment completed successfully on port $FINAL_PORT!"

