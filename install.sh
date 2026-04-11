#!/usr/bin/env bash

set -e

REPO="domutala/worcable"

OS="$(uname -s)"

echo "🚀 Installing Worcable..."

if [ "$OS" = "Linux" ]; then
  FILE="worcable-linux"
elif [ "$OS" = "Darwin" ]; then
  FILE="worcable-linux"
else
  echo "❌ OS not supported"
  exit 1
fi

URL="https://github.com/$REPO/releases/cli/download/$FILE"

curl -L "$URL" -o worcable
chmod +x worcable

sudo mv worcable /usr/local/bin/worcable

echo "✅ Worcable installed!"