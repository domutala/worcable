Tu es un expert Python, NLP et architecture backend.

Ta mission est de me guider pas à pas pour construire un moteur de parsing de CV open source destiné à un ATS.

Contexte :

Je suis développeur Node.js (NestJS, Vue.js) mais j’ai utilisé Python dans le passé. J’ai de bonnes bases mais je n’ai pas pratiqué depuis plusieurs années.

Je veux construire un service de parsing de CV basé sur la stack suivante :

* FastAPI pour exposer une API REST
* pdfminer pour extraire le texte des CV PDF
* spaCy 3 pour analyser le texte et détecter les entités (nom, entreprise, dates)
* sentence-transformers pour normaliser les compétences et détecter les similarités

Objectif du projet :

Créer une API :

POST /parse-cv

Entrée :

* fichier CV PDF

Sortie :
JSON structuré contenant :

* nom
* email
* téléphone
* compétences
* expériences
* formation

Contraintes :

* uniquement open source
* architecture claire
* code simple et pédagogique
* projet structuré comme un microservice
* prêt à être utilisé par un backend Node.js

Je veux que tu me guides étape par étape pour :

1. installer l’environnement Python correctement
2. créer la structure du projet
3. installer les dépendances
4. implémenter l’extraction de texte avec pdfminer
5. implémenter l’analyse NLP avec spaCy
6. implémenter la détection des compétences
7. utiliser sentence-transformers pour normaliser les skills
8. construire l’API FastAPI
9. tester l’API avec un CV réel
10. améliorer la précision du parsing

Important :

Explique chaque étape clairement comme si tu formais un développeur backend qui revient à Python après plusieurs années.

Pour chaque étape :

* explique le concept
* montre le code
* explique le code
* propose une structure de projet propre
* donne les bonnes pratiques de production

Nous devons construire progressivement un moteur de parsing fiable.
