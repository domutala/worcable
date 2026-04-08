#!/bin/bash

set -e  # stop si erreur

echo "🚀 Starting deployment..."

echo "📥 Pull latest changes..."
git pull origin main

echo "🐳 Pull Docker images..."
docker compose pull

echo "🧹 Stop old containers..."
docker compose down

echo "🚀 Start containers..."
docker compose up -d --build

echo "✅ Deployment finished!"