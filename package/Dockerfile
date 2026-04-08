# Étape de build
FROM node:20-slim AS builder

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code et build
COPY . .
RUN npm run build

# Étape de production
FROM node:20-slim AS runner

WORKDIR /app

# On ne récupère que le dossier de sortie de Nuxt (.output)
COPY --from=builder /app/.output ./.output

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]