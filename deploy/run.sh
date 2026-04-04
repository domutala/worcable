#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

PROJECT="all"

while [[ $# -gt 0 ]]; do
  case $1 in
    --project)
      PROJECT="$2"
      shift 2
      ;;
    --stop)
      ACTION="stop"
      shift
      ;;
    --logs)
      ACTION="logs"
      shift
      ;;
    *)
      shift
      ;;
  esac
done

# Define profiles and the list of enabled services
case $PROJECT in
  all)
    export ENABLED_SERVICES="base,db,parser"
    PROFILES="--profile db --profile parser"
    MSG="All services (Nuxt, DB, Parser)"
    ;;
  db)
    export ENABLED_SERVICES="base,db"
    PROFILES="--profile db"
    MSG="Nuxt + MongoDB"
    ;;
  parser)
    export ENABLED_SERVICES="base,parser"
    PROFILES="--profile parser"
    MSG="Nuxt + CV Parser"
    ;;
  base)
    export ENABLED_SERVICES="base"
    PROFILES=""
    MSG="Nuxt only"
    ;;
  *)
    echo "Unknown project: $PROJECT"
    exit 1
    ;;
esac

cd "$ROOT_DIR"

if [ "$ACTION" == "stop" ]; then
    echo "Stopping: $MSG..."
    docker compose -f "$COMPOSE_FILE" $PROFILES stop
elif [ "$ACTION" == "logs" ]; then
    docker compose -f "$COMPOSE_FILE" $PROFILES logs -f
else
    echo "Starting: $MSG (Enabled: $ENABLED_SERVICES)..."
    # Exporting the variable so Docker Compose can read it
    docker compose -f "$COMPOSE_FILE" $PROFILES up -d --build
fi