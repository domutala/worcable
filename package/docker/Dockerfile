# --- Étape 1 : Build ---
FROM node:20-slim AS builder

RUN npm install -g pnpm@10.23.0

WORKDIR /app

# On ne copie que les fichiers de dépendances pour optimiser le cache Docker
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# On copie le reste du code et on build
COPY . .
RUN pnpm build

# --- Étape 2 : Production ---
FROM node:20-slim

WORKDIR /app

# On installe pnpm juste pour d'éventuels scripts, mais l'app tournera via Node
RUN npm install -g pnpm@10.23.0

# On récupère UNIQUEMENT le dossier compilé du builder
COPY --from=builder /app/.output ./.output

# Nuxt 3 utilise le port 3000 par défaut en prod
EXPOSE 3000

# On lance directement le serveur compilé
# C'est ultra rapide et ça ne nécessite aucune connexion internet au démarrage
CMD ["node", ".output/server/index.mjs"]