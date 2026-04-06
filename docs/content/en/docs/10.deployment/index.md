---
title: Introduction
description: Choose the deployment method that fits your environment and launch Worcable.
---

Worcable’s deployment is designed to be as flexible as possible. Whether you're in a local testing phase, active development, or production deployment, two approaches are available to you.

## Initial Setup

Before choosing your method, start by retrieving the project sources and configuring your base environment variables.

```bash [Terminal]
# Clone the monorepo
git clone https://github.com/domutala/worcable.git
cd worcable

# Initialize configuration
cp .env.example .env
````

## A Modular Architecture

Beyond choosing the environment (Docker or Native), Worcable is designed with a **modular approach**. This means you don’t have to deploy the entire stack if your needs are specific.

Thanks to the unified orchestrator, you can precisely control which components are active:

* **Core Mode**: Deploy only the Nuxt 3 application (Base).
* **Data Mode**: Combine the application with its MongoDB database.
* **Full-Service Mode**: Enable independent microservices like `cvparser` (Python/FastAPI).
* **Hybrid Mode**: Use your own database instances (e.g., MongoDB Atlas) and deploy only Worcable’s application logic.

### Flexibility Example

If you already have an external MongoDB server, you can launch only the interface and the parsing service:

```bash [Terminal]
./deploy/run.sh base cvparser
```

## Choose Your Method

Depending on your infrastructure and your familiarity with containers, select one of the following approaches:

::card-group
    ::card
    ---
    title: Docker Deployment 
    icon: i-simple-icons-docker 
    to: /en/docs/deployment/docker
    ---

    **Recommended method.** Everything is preconfigured (Nuxt, MongoDB, Parser). Ideal for fast and isolated deployment.
    ::

    ::card
    ---
    title: Native Deployment
    icon: i-lucide-terminal 
    to: /en/docs/deployment/native
    ---

    **Without containers.** Direct installation on your host system using pnpm and Python virtual environments. Ideal for environments where Docker is not available or to optimize resource usage.
    ::
::

## Understanding the Architecture

If you want to understand how services communicate with each other before deploying, we recommend reading the documentation about the internal engine.

::card
---
title: Worcable Engine
icon: i-lucide-cpu
to: /en/docs/concepts/engine
---

Discover the monorepo architecture, independent service management, and the technical foundations of the platform.
::

::callout{icon="i-lucide-help-circle" color="neutral"}
**Need help?** If you encounter any issues during these steps, feel free to check our [troubleshooting guide](/en/docs/getting-started).
::

