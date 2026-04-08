# --- Étape 1 : Build ---
FROM node:20-slim AS builder

# Installation des dépendances système nécessaires pour la compilation de modules natifs (SQLite)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@10.23.0

WORKDIR /app

# On copie les fichiers de lock
COPY package.json pnpm-lock.yaml ./

# pnpm install va maintenant pouvoir compiler better-sqlite3 sans erreur
RUN pnpm install --frozen-lockfile && pnpm add -D tailwindcss

# On copie le reste du code et on build
COPY . .
RUN pnpm build

# --- Étape 2 : Production ---
FROM node:20-slim

WORKDIR /app

# On n'a pas besoin de python/g++ en production, l'image reste légère
COPY --from=builder /app/.output ./.output

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]