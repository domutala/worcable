#!/bin/bash

# Path configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"

# Initialization
PROJECTS=()
ACTION="start"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Argument parsing
while [[ $# -gt 0 ]]; do
  case $1 in
    --stop)
      ACTION="stop"
      shift
      ;;
    --logs)
      ACTION="logs"
      shift
      ;;
    *)
      PROJECTS+=("$1")
      shift
      ;;
  esac
done

if [ ${#PROJECTS[@]} -eq 0 ]; then
  PROJECTS=("all")
fi

# Build profiles
PROFILES=""
ENABLED_SERVICES=""

for PROJ in "${PROJECTS[@]}"; do
  case $PROJ in
    all)
      PROFILES="--profile db --profile cvparser"
      ENABLED_SERVICES="base, db, parser"
      ;;
    db)
      PROFILES="$PROFILES --profile db"
      ENABLED_SERVICES="$ENABLED_SERVICES db,"
      ;;
    cvparser)
      PROFILES="$PROFILES --profile cvparser"
      ENABLED_SERVICES="$ENABLED_SERVICES cvparser,"
      ;;
    notification)
      PROFILES="$PROFILES --profile notification"
      ENABLED_SERVICES="$ENABLED_SERVICES notification,"
      ;;
    base)
      ENABLED_SERVICES="$ENABLED_SERVICES base,"
      ;;
  esac
done

ENABLED_SERVICES=$(echo $ENABLED_SERVICES | sed 's/,$//')

cd "$ROOT_DIR"

if [ "$ACTION" == "stop" ]; then
    echo -e "${YELLOW}🛑 Stopping services: ${PROJECTS[*]}...${NC}"
    docker compose -f "$COMPOSE_FILE" $PROFILES stop
elif [ "$ACTION" == "logs" ]; then
    echo -e "${BLUE}📋 Showing logs for: ${PROJECTS[*]}...${NC}"
    docker compose -f "$COMPOSE_FILE" $PROFILES logs -f
else
    echo -e "${GREEN}🚀 Starting Worcable...${NC}"
    echo -e "${BLUE}ℹ️ Enabled modules: $ENABLED_SERVICES${NC}"
    
    export ENABLED_SERVICES
    docker compose -f "$COMPOSE_FILE" $PROFILES up -d --build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Worcable is online!${NC}"
        echo -e "${YELLOW}👉 Access: http://localhost:3000${NC}"
    fi
fi