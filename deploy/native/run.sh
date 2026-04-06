#!/bin/bash

# Path configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
PACKAGE_DIR="$ROOT_DIR/package"
PARSER_DIR="$ROOT_DIR/cvparser"

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
    *)
      PROJECTS+=("$1")
      shift
      ;;
  esac
done

if [ ${#PROJECTS[@]} -eq 0 ]; then
  PROJECTS=("all")
fi

if [ "$ACTION" == "stop" ]; then
    echo -e "${YELLOW}ℹ️ In native mode, use CTRL+C in the active terminal to stop services.${NC}"
    exit 0
fi

echo -e "${BLUE}--- Worcable Native Runner ---${NC}"

# Prerequisites check
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ Error: pnpm is not installed.${NC}"
    exit 1
fi

# --- Launch functions ---

start_cvparser() {
    if [ -d "$PARSER_DIR" ]; then
        echo -e "${GREEN}🚀 Preparing CV Parser (FastAPI)...${NC}"
        cd "$PARSER_DIR"
        if [ ! -d "venv" ]; then
            python3 -m venv venv
        fi
        source venv/bin/activate
        pip install -r requirements.txt --quiet
        python3 app/main.py &
        PARSER_PID=$!
        echo -e "${GREEN}✅ CV Parser started (PID: $PARSER_PID)${NC}"
    else
        echo -e "${RED}⚠️ Directory cvparser not found.${NC}"
    fi
}

start_nuxt() {
    if [ -d "$PACKAGE_DIR" ]; then
        echo -e "${GREEN}🚀 Preparing App (Nuxt 3)...${NC}"
        cd "$PACKAGE_DIR"
        if [ ! -d "node_modules" ]; then
            pnpm install
        fi
        pnpm dev &
        NUXT_PID=$!
        echo -e "${GREEN}✅ Nuxt App started (PID: $NUXT_PID)${NC}"
    else
        echo -e "${RED}⚠️ Directory package not found.${NC}"
    fi
}

# --- Execution ---

ENABLED_MSG=""

for PROJ in "${PROJECTS[@]}"; do
  case $PROJ in
    all)
      start_cvparser
      start_nuxt
      ENABLED_MSG="All services"
      ;;
    db|base)
      start_nuxt
      ENABLED_MSG="$ENABLED_MSG Nuxt (Note: MongoDB must be running locally),"
      ;;
    cvparser|parser)
      start_cvparser
      ENABLED_MSG="$ENABLED_MSG CV Parser,"
      ;;
    notification)
      echo -e "${YELLOW}🔔 Notification Service: Coming soon...${NC}"
      ;;
  esac
done

echo -e "${YELLOW}✨ Active Mode: $(echo $ENABLED_MSG | sed 's/,$//')${NC}"
echo -e "${BLUE}💡 Press [CTRL+C] to stop all services.${NC}"

cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping services...${NC}"
    [ ! -z "$NUXT_PID" ] && kill $NUXT_PID 2>/dev/null
    [ ! -z "$PARSER_PID" ] && kill $PARSER_PID 2>/dev/null
    echo -e "${GREEN}👋 Worcable stopped.${NC}"
    exit
}

trap cleanup SIGINT SIGTERM
wait