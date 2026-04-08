FROM node:20-slim

# Installation de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# On copie tout le contenu de package/ dans /app
COPY package/ .

# On s'assure que le script a les droits d'exécution
RUN chmod +x ./deploy.sh

# Le point d'entrée unique
ENTRYPOINT ["./entrypoint.sh"]