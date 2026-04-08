FROM node:20-slim

# Installation de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY . .

# On s'assure que le script a les droits d'exécution
RUN chmod +x ./entrypoint.sh

# Le point d'entrée unique
ENTRYPOINT ["./entrypoint.sh"]