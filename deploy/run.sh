#!/bin/bash

# Path configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_RUN="$SCRIPT_DIR/docker/run.sh"
NATIVE_RUN="$SCRIPT_DIR/native/run.sh"

# Default settings
MODE="docker"
ARGS=()

# Colors
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

while [[ $# -gt 0 ]]; do
  case $1 in
    --native)
      MODE="native"
      shift
      ;;
    --docker)
      MODE="docker"
      shift
      ;;
    *)
      ARGS+=("$1")
      shift
      ;;
  esac
done

echo -e "${BLUE}--- Worcable Orchestrator ---${NC}"

if [ "$MODE" == "docker" ]; then
    if [ -f "$DOCKER_RUN" ]; then
        echo -e "${BLUE}🐳 Selected Mode: Docker${NC}"
        chmod +x "$DOCKER_RUN"
        bash "$DOCKER_RUN" "${ARGS[@]}"
    else
        echo -e "${RED}❌ Error: Docker script not found ($DOCKER_RUN)${NC}"
        exit 1
    fi
else
    if [ -f "$NATIVE_RUN" ]; then
        echo -e "${BLUE}🚀 Selected Mode: Native${NC}"
        chmod +x "$NATIVE_RUN"
        bash "$NATIVE_RUN" "${ARGS[@]}"
    else
        echo -e "${RED}❌ Error: Native script not found ($NATIVE_RUN)${NC}"
        exit 1
    fi
fi