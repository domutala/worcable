#!/bin/bash

# Arrêter le script en cas d'erreur
set -e

echo "-------------------------------------------------------"
echo "🚀 Worcable : Démarrage du processus de déploiement..."
echo "-------------------------------------------------------"

# 1. Vérification de l'environnement
echo "🔍 Vérification de l'environnement Node..."
node -v
pnpm -v

# 2. Installation des dépendances
# On utilise --frozen-lockfile pour garantir l'intégrité du pnpm-lock.yaml
echo "📦 Installation des dépendances avec pnpm..."
pnpm install --frozen-lockfile

# 3. Build de l'application Nuxt
# Les variables d'environnement injectées au conteneur seront lues ici
echo "🏗️  Compilation de Nuxt (Ceci peut prendre un moment)..."
pnpm build

# 4. Nettoyage (Optionnel)
# Vous pouvez supprimer les devDependencies pour alléger le conteneur en RAM
# pnpm prune --prod

# 5. Lancement de l'application
if [ -d ".output" ]; then
    echo "-------------------------------------------------------"
    echo "✅ Build terminé avec succès."
    echo "📡 Lancement du serveur sur le port ${PORT:-3000}..."
    echo "-------------------------------------------------------"
    
    # exec permet à Node de devenir le processus principal (PID 1)
    # C'est crucial pour que Docker puisse arrêter le conteneur proprement
    exec node .output/server/index.mjs
else
    echo "❌ Erreur : Le dossier de sortie .output est introuvable."
    exit 1
fi