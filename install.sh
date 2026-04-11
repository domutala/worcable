#!/usr/bin/env bash

set -e

REPO="domutala/worcable"

OS="$(uname -s)"
ARCH="$(uname -m)"

echo "🚀 Installing Worcable..."

# Detect OS
case "$OS" in
  Linux)
    PLATFORM="linux"
    ;;
  Darwin)
    PLATFORM="darwin"
    ;;
  *)
    echo "❌ OS not supported: $OS"
    exit 1
    ;;
esac

# Detect architecture
case "$ARCH" in
  x86_64)
    ARCH="amd64"
    ;;
  arm64|aarch64)
    ARCH="arm64"
    ;;
  *)
    echo "❌ Architecture not supported: $ARCH"
    exit 1
    ;;
esac

FILE="worcable-${PLATFORM}-${ARCH}"
URL="https://github.com/${REPO}/releases/cli/download/${FILE}"

echo "📦 Downloading $FILE..."

# Download
curl -fL "$URL" -o worcable

# Make executable
chmod +x worcable

# Install
if [ -w "/usr/local/bin" ]; then
  mv worcable /usr/local/bin/worcable
else
  echo "🔐 Need sudo privileges to install..."
  sudo mv worcable /usr/local/bin/worcable
fi

echo "✅ Worcable installed successfully!"
echo "👉 Run: worcable --help"