#!/bin/bash

# Arrêter le script en cas d'erreur
set -e

# Arguments
IMAGE_TAG=$1
BRANCH=$2
BASE_URL=$3
MONGO_USER=$4
MONGO_PWD=$5
BASE_DIR=$6

echo "🚀 Début du déploiement dans : $TARGET_DIR"

TARGET_DIR="$BASE_DIR/package-$BRANCH"
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR" || exit 1

# --- 1. Logique de Port Dynamique ---
if [ "$BRANCH" == "main" ]; then SUGGESTED_PORT=3000;
elif [ "$BRANCH" == "dev" ]; then SUGGESTED_PORT=3001;
else SUGGESTED_PORT=3002; fi

is_port_free() {
  ! ss -tuln | grep -q ":$1 "
}

FINAL_PORT=$SUGGESTED_PORT
if ! is_port_free $FINAL_PORT; then
  echo "⚠️ Port $FINAL_PORT is busy. Searching for a free port..."
  for port in {3005..3999}; do
    if is_port_free $port; then
      FINAL_PORT=$port
      break
    fi
  done
fi
echo "✅ Using Port: $FINAL_PORT"

# --- 2. Logique de Formatage des URLs ---
if [ "$BRANCH" == "main" ]; then
  DOMAIN="$BASE_URL"
  APP_URL="https://$BASE_URL"
  DB_NAME="worcable_prod"
else
  DOMAIN="$BRANCH.sandbox.$BASE_URL"
  APP_URL="https://$BRANCH.sandbox.$BASE_URL"
  DB_NAME="worcable_${BRANCH}_sandbox"
fi

# --- 3. Gestion de la NUXT_SECRET_KEY ---
if [ -f "package.env" ] && grep -q "NUXT_SECRET_KEY=" package.env; then
  SECRET_KEY=$(grep "NUXT_SECRET_KEY=" package.env | cut -d'=' -f2-)
else
  SECRET_KEY=$(openssl rand -base64 48 | tr -d '\n')
fi

# --- 4. Création des fichiers ---
cat <<EOF > .env
IMAGE_TAG=$IMAGE_TAG
BRANCH_NAME=$BRANCH
HOST_PORT=$FINAL_PORT
DOMAIN=$DOMAIN
EOF

cat <<EOF > package.env
PORT=$FINAL_PORT
NUXT_PUBLIC_APP_URL=$APP_URL
NUXT_DATABASE_URL="mongodb+srv://$MONGO_USER:$MONGO_PWD@cluster0.l1qnkbx.mongodb.net/$DB_NAME"
NUXT_SECRET_KEY=$SECRET_KEY
EOF

# --- 5. Déploiement ---
echo "📥 Pulling images..."
docker compose pull
echo "🆙 Démarrage des containers..."
docker compose up -d --remove-orphans
echo "🧹 Nettoyage des anciennes images..."
docker image prune -f

echo "✨ Déploiement terminé avec succès sur le port $FINAL_PORT !"