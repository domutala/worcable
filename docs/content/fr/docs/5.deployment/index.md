---
title: Introduction
description: Choisissez la méthode de déploiement adaptée à votre environnement et lancez Worcable.
---

Le déploiement de Worcable a été pensée pour être la plus flexible possible. Que vous soyez en phase de test local, en développement actif ou en déploiement de production, deux chemins s'offrent à vous.



## Préparation initiale

Avant de choisir votre méthode, commencez par récupérer les sources du projet et configurer vos variables d'environnement de base.

```bash [Terminal]
# Cloner le monorepo
git clone https://github.com/domutala/worcable.git
cd worcable

# Initialiser la configuration
cp .env.example .env
```

## Une architecture à la carte

Au-delà du choix de l'environnement (Docker ou Natif), Worcable est conçu selon une approche **modulaire**. Cela signifie que vous n'êtes pas obligé de déployer l'intégralité de la stack si vos besoins sont spécifiques.

Grâce à notre orchestrateur unifié, vous pouvez piloter finement les composants actifs :

* **Mode Core** : Déployez uniquement l'application Nuxt 3 (Base).
* **Mode Data** : Couplez l'application avec sa base de données MongoDB.
* **Mode Full-Service** : Activez les micro-services indépendants comme le `cvparser` (Python/FastAPI).
* **Mode Hybride** : Utilisez vos propres instances de base de données (ex: MongoDB Atlas) et ne déployez que la logique applicative de Worcable.

### Exemple de flexibilité
Si vous disposez déjà d'un serveur MongoDB externe, vous pouvez lancer uniquement l'interface et le service de parsing :
```bash [Terminal]
./deploy/run.sh base cvparser
```

## Choisissez votre méthode

Selon votre infrastructure et votre aisance avec les conteneurs, sélectionnez l'une des deux approches ci-dessous :

::card-group 
    ::card
    ---
    title: Déploiement Docker 
    icon: i-simple-icons-docker 
    to: /en/docs/deployment/docker
    ---

    **La méthode recommandée.** Tout est pré-configuré (Nuxt, MongoDB, Parser). Idéal pour un déploiement rapide et isolé.
    ::

    ::card
    ---
    title: Déploiement Natif
    icon: i-lucide-terminal 
    to: /en/docs/deployment/native
    ---

    **Sans conteneur.** Installation directe sur votre système hôte via pnpm et Python venv. Idéal pour les environnements où Docker n'est pas disponible ou pour optimiser les ressources.
    ::
::

## Comprendre l'Architecture

Si vous souhaitez comprendre comment les services communiquent entre eux avant de lancer le déploiement, nous vous recommandons de lire la documentation sur le moteur interne.

::card
---
title: Worcable Engine 
icon: i-lucide-cpu
to: /en/concepts/engine
---

Découvrez l'architecture monorepo, la gestion des services indépendants et les fondations techniques de la plateforme.
::

::callout{icon="i-lucide-help-circle" color="neutral"}
**Besoin d'aide ?** Si vous rencontrez des difficultés lors de l'une de ces étapes, n'hésitez pas à consulter notre [guide de dépannage](/en/docs/getting-started).
::

