#!/bin/bash

SERVICE_NAME="worcable.listener.service"
SERVICE_PATH="/etc/systemd/system/$SERVICE_NAME"

PROJECT_DIR="/cl"
ENTRY_FILE="src/listener/server.ts"

USER_NAME=$(whoami)

echo "🚀 Création du service $SERVICE_NAME ..."

sudo bash -c "cat > $SERVICE_PATH" <<EOL
[Unit]
Description=Worcable GitHub Listener Service
After=network.target

[Service]
Type=simple
User=$USER_NAME
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/npx ts-node $ENTRY_FILE
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000

# Logs

StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOL

echo "🔄 Reload systemd..."
sudo systemctl daemon-reexec
sudo systemctl daemon-reload

echo "✅ Activation du service..."
sudo systemctl enable $SERVICE_NAME

echo "🚀 Démarrage du service..."
sudo systemctl start $SERVICE_NAME

echo "📊 Status du service:"
sudo systemctl status $SERVICE_NAME

echo "🎉 Service installé avec succès !"
