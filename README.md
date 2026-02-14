# Worcable 🚀  
**Une plateforme open source moderne pour simplifier et structurer le recrutement**

[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)](https://github.com/domutala/worcable)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Worcable-black?logo=github)](https://github.com/domutala/worcable)

---

## 1. Présentation du projet

**Worcable** est un logiciel open source de gestion du recrutement (ATS – Applicant Tracking System) conçu pour aider les entreprises à structurer, suivre et optimiser leurs processus de recrutement.

### 🎯 Le problème

Beaucoup d’entreprises — startups, PME ou grandes structures — gèrent encore leurs recrutements avec :
- Des emails dispersés
- Des fichiers Excel peu structurés
- Des outils coûteux ou fermés
- Des processus peu collaboratifs

Résultat : perte de candidats qualifiés, manque de visibilité, décisions lentes.

### 💡 La vision

Worcable a pour ambition de devenir une **plateforme open source moderne, flexible et évolutive**, permettant :

- Une gestion claire et collaborative des recrutements  
- Une centralisation des candidatures  
- Une meilleure prise de décision basée sur la donnée  
- Une alternative open source aux ATS propriétaires  

---

## 2. Fonctionnalités principales

> Certaines fonctionnalités peuvent être en cours de développement.

### 👥 Gestion des candidats
- Centralisation des candidatures
- Fiches candidats détaillées
- Historique des interactions
- Upload et gestion de CV

### 📂 Gestion des offres d’emploi
- Création et publication d’offres
- Statut (ouverte, fermée, en pause)
- Attribution à des recruteurs

### 🔄 Pipeline de recrutement
- Workflow personnalisable (Screening, Entretien, Test, Offre, etc.)
- Drag & drop des candidats entre les étapes
- Suivi clair de l’avancement

### 📝 Évaluations & feedback
- Notes et commentaires internes
- Collaboration entre recruteurs et managers
- Historique des décisions

### 📊 Tableaux de bord & statistiques
- Nombre de candidatures par offre
- Taux de conversion entre étapes
- Suivi des performances de recrutement

### 🔐 Gestion des rôles & permissions
- Admin
- Recruteur
- Manager
- Accès contrôlé aux données

### 🌍 API & extensibilité
- API REST
- Intégration possible avec d’autres outils (HR, email, etc.)

---

## 3. Pourquoi Worcable ?

### ⚡ Open Source par conviction

- Transparence totale du code
- Liberté d’adaptation
- Possibilité d’auto-hébergement
- Communauté au cœur du projet

### 🧱 Pensé pour être extensible

Contrairement à de nombreux ATS fermés :
- Worcable peut être personnalisé selon les besoins métier
- L’architecture vise la modularité
- Les entreprises peuvent l’adapter à leur contexte local

### 💸 Une alternative aux solutions coûteuses

De nombreuses solutions SaaS de recrutement :
- Sont onéreuses
- Limitent les personnalisations
- Enferment les données

Worcable propose une alternative :
- Flexible
- Évolutive
- Contrôlée par ses utilisateurs

### 🌍 Accessible partout

Worcable vise à être utilisable par :
- Startups
- PME
- ONG
- Structures en croissance
- Écosystèmes émergents

---

## 4. Aperçu visuel

> 🚧 À venir

Des captures d’écran et/ou une démo en ligne seront ajoutées prochainement pour illustrer :

- Le tableau de bord
- Le pipeline de recrutement
- La gestion des candidats
- Les statistiques

---

## 5. Installation rapide

> ⚠️ Ceci est une installation simplifiée pour tester le projet.

### 1️⃣ Cloner le dépôt

```bash
git clone https://github.com/domutala/worcable.git
cd worcable
````

### 2️⃣ Installer les dépendances

```bash
pnpm install
```

### 3️⃣ Configurer les variables d’environnement

Créer un fichier `.env` basé sur `.env.example` :

```bash
cp .env.example .env
```

Configurer :

* Base de données
* Port
* Clés API si nécessaires

### 4️⃣ Lancer l’application

```bash
yarn dev
```

L’application sera accessible sur :

```
https://localhost:4730
```

> Pour plus de détails techniques, consulter la documentation interne du projet.

---

## 6. Contribution 🤝

Worcable est un projet open source et toute contribution est la bienvenue.

### Comment contribuer ?

1. Fork le projet
2. Créer une branche :

   ```bash
   git checkout -b feature/my-feature
   ```
3. Commit vos changements :

   ```bash
   git commit -m "feat: add new recruitment stage"
   ```
4. Push :

   ```bash
   git push origin feature/my-feature
   ```
5. Ouvrir une Pull Request

### Autres façons de contribuer

* Signaler un bug via les Issues
* Proposer une amélioration
* Améliorer le README ou la documentation
* Partager le projet

---

## 7. Roadmap 🛣️

Voici quelques évolutions prévues :

* [ ] Pipeline de recrutement entièrement personnalisable
* [ ] Notifications email automatiques
* [ ] Intégration avec LinkedIn / job boards
* [ ] Système de scoring intelligent des candidats
* [ ] Multi-entreprises (multi-tenant)
* [ ] Tableau de bord analytique avancé
* [ ] Version SaaS auto-hébergée

La roadmap évoluera en fonction des contributions et des retours de la communauté.

---

## 8. Licence 📄

Worcable est un projet open source.

Consultez le fichier `LICENSE` du dépôt pour connaître les détails de la licence utilisée.

---

## 9. Auteur & Maintainers 👨‍💻

**Créateur :**

* [@domutala](https://github.com/domutala)

Contributeurs :

> À venir — soyez le prochain à apparaître ici ✨

---

## ⭐ Soutenir le projet

Si vous trouvez Worcable utile :

* ⭐ Mettez une étoile sur GitHub
* 🍴 Forkez le projet
* 🗣️ Partagez-le autour de vous

---

## 📌 En résumé

Worcable est une initiative open source visant à rendre le recrutement :

* Plus structuré
* Plus collaboratif
* Plus transparent
* Plus accessible

Rejoignez l’aventure et construisons ensemble un outil de recrutement moderne, libre et évolutif. 🚀

