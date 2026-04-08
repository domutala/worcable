# 🚀 Worcable Package

Image Docker officielle du service principal de **Worcable**.

---

## 📦 Description

Worcable est une plateforme moderne construite avec **Nuxt 3**, intégrant à la fois :

* Frontend (UI)
* Backend (API server)
* Logique métier centralisée

Cette image Docker permet de déployer facilement l’application en production sans dépendre du code source.

---

## 🐳 Image Docker

Disponible sur Docker Hub :

```
domutala/worcable-package
```

---

## 🚀 Utilisation rapide

### 1. Lancer avec Docker

```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NUXT_DATABASE_URL=mongodb://localhost:27017/worcable \
  domutala/worcable-package:latest
```

---

### 2. Utilisation avec Docker Compose

```yaml
services:
  worcable:
    image: domutala/worcable-package:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NUXT_DATABASE_URL=mongodb://mongodb:27017/worcable
    restart: always
```

---

## ⚙️ Variables d'environnement

| Variable            | Description              | Valeur par défaut                  |
| ------------------- | ------------------------ | ---------------------------------- |
| `PORT`              | Port de l'application    | `3000`                             |
| `NODE_ENV`          | Mode d'exécution         | `production`                       |
| `NUXT_DATABASE_URL` | URL de connexion MongoDB | `mongodb://mongodb:27017/worcable` |

---

## 🏷️ Tags disponibles

* `latest` → version stable (branche `main`)
* `release-*` → versions de release (ex: `v1.0`)
* `sha-xxxx` → version précise (traçabilité)

---

## 🔄 CI/CD

L’image est automatiquement :

1. Build via GitHub Actions
2. Publiée sur Docker Hub
3. Versionnée avec :

   * `latest` (main)
   * `release/*`
   * SHA commit

---

## 📁 Structure du projet

```
package/
 ├── docker/
 │    └── Dockerfile
 ├── server/
 ├── components/
 └── ...
```

---

## 🧠 Bonnes pratiques

* Utiliser un `.env` en production
* Ne pas builder sur le serveur
* Utiliser `docker compose pull` pour les mises à jour
* Monitorer les logs (`docker logs`)

---

## 🔐 Sécurité

* Ne jamais exposer MongoDB publiquement
* Utiliser un reverse proxy (Nginx)
* Activer HTTPS (Let's Encrypt)

---

## 🚀 Déploiement recommandé

```bash
docker compose pull
docker compose up -d
```

---

## 📌 Roadmap

* [ ] Support multi-services (workers, queue)
* [ ] Observabilité (logs + metrics)
* [ ] Scaling horizontal

---

## 👨‍💻 Auteur

Développé par @domutala

---

## 📄 Licence

MIT
