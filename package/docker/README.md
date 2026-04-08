# Worcable Package

Official Docker image for the **Worcable** platform.


## 🐳 Docker Image
```bash
domutala/worcable-package:latest
```

## 🛠️ Quick Start

### Docker Compose
```yaml
services:
  worcable:
    image: domutala/worcable-package:latest
    ports:
      - "3000:3000"
    environment:
      - NUXT_PUBLIC_APP_URL=https://your-app.com
      - NUXT_DATABASE_URL=mongodb://your-db-url
      - NUXT_SECRET_KEY=your_generated_secret_key
    restart: always
```

### Docker CLI
```bash
docker run -d -p 3000:3000 \
  -e NUXT_PUBLIC_APP_URL=https://your-app.com \
  -e NUXT_DATABASE_URL=mongodb://your-db-url \
  -e NUXT_SECRET_KEY=$(openssl rand -base64 32) \
  domutala/worcable-package
```

---

## ⚙️ Configuration

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Internal listening port | `3000` |
| `NUXT_PUBLIC_APP_URL` | Public application URL | *(Required)* |
| `NUXT_DATABASE_URL` | MongoDB connection string | *(Required)* |
| `NUXT_SECRET_KEY` | Key for session/cookie encryption | *(Required)* |

> **Pro Tip:** Generate a secure key with: `openssl rand -base64 60`

---

## 🏷️ Tags & CI/CD
* **`latest`** : Stable version from `main`.
* **`release-*`** : Tagged production releases.
* **`sha-*`** : Specific builds for traceability.

---

## 🔐 Best Practices
* **Reverse Proxy**: Always use Nginx or Traefik for SSL/TLS termination.
* **Updates**: Run `docker compose pull && docker compose up -d` for seamless updates.
* **Security**: Ensure your MongoDB instance is protected by a firewall and not publicly accessible.

---

**Developed by:** [@domutala](https://github.com/domutala)  
**License:** MIT